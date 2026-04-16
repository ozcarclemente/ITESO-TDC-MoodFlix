// server/scripts/seed.ts

import axios from 'axios';
import mongoose from 'mongoose';
import { Movie } from '../models/movie.model';
import { deriveScores } from '../services/derive-scores.service';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_TOKEN = process.env.TMDB_API_TOKEN!;
const MONGO_URI = process.env.MONGODB_URI!;

const headers = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
};

interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    genre_ids: number[];
    release_date: string;
    runtime?: number;
    vote_average: number;
    poster_path?: string;
}

interface TMDBGenre {
    id: number;
    name: string;
}

async function fetchGenreMap(): Promise<Record<number, string>> {
    const { data } = await axios.get(`${TMDB_BASE}/genre/movie/list`, { headers });
    return data.genres.reduce((acc: Record<number, string>, g: TMDBGenre) => {
        acc[g.id] = g.name;
        return acc;
    }, {});
}

async function fetchMovieDetails(tmdbId: number): Promise<{ runtime: number; ageRating: string; providers: string[] }> {
    const [detailsRes, releasesRes, providersRes] = await Promise.all([
        axios.get(`${TMDB_BASE}/movie/${tmdbId}`, { headers }),
        axios.get(`${TMDB_BASE}/movie/${tmdbId}/release_dates`, { headers }),
        axios.get(`${TMDB_BASE}/movie/${tmdbId}/watch/providers`, { headers }),
    ]);

    const runtime = detailsRes.data.runtime ?? 0;

    // ageRating — busca US primero, si no MX
    const releases: { iso_3166_1: string; release_dates: { certification: string }[] }[] =
        releasesRes.data.results;
    const region = releases.find(r => r.iso_3166_1 === 'US') ?? releases.find(r => r.iso_3166_1 === 'MX');
    const ageRating = region?.release_dates.find(rd => rd.certification)?.certification ?? '';

    // providers — región MX primero, si no US
    const providersData = providersRes.data.results;
    const regionProviders = providersData?.MX ?? providersData?.US ?? {};
    const flatrate: { provider_name: string }[] = regionProviders.flatrate ?? [];
    const providers = flatrate.map(p => p.provider_name);

    return { runtime, ageRating, providers };
}

async function fetchPage(page: number): Promise<TMDBMovie[]> {
    const { data } = await axios.get(`${TMDB_BASE}/discover/movie`, {
        headers,
        params: {
            language: 'en-US',
            sort_by: 'vote_count.desc',
            'vote_count.gte': 500,
            page,
        },
    });
    return data.results;
}

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const genreMap = await fetchGenreMap();
    let inserted = 0;
    let page = 1;

    while (inserted < 500) {
        const movies = await fetchPage(page);
        if (!movies.length) break;

        for (const movie of movies) {
            if (inserted >= 500) break;

            const exists = await Movie.findOne({ tmdbId: movie.id });
            if (exists) continue;

            try {
                const { runtime, ageRating, providers } = await fetchMovieDetails(movie.id);
                const genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean);
                const scores = deriveScores(genres, movie.vote_average);
                const releaseYear = movie.release_date
                    ? parseInt(movie.release_date.split('-')[0])
                    : undefined;

                await Movie.create({
                    tmdbId: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    genres,
                    releaseYear,
                    runtimeMinutes: runtime,
                    ratingAvg: movie.vote_average,
                    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : undefined,
                    ageRating,
                    providers,
                    scores,
                    fetchedAt: new Date(),
                });

                await sleep(1000);

                inserted++;
                console.log(`[${inserted}/500] ${movie.title}`);
            } catch (err) {
                console.error(`Error processing ${movie.title}:`, err);
            }
        }

        page++;
    }

    console.log(`Seed completo: ${inserted} películas insertadas`);
    await mongoose.disconnect();
}


function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Solo ejecutar  para evitar ejecuciones accidentales 


// Descomentar cuando se quiera poblar la base de datos
// Después de ejecutar, comentar nuevamente para evitar ejecuciones accidentales
// seed(); 
