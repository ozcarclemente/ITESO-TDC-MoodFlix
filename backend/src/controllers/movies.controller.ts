import { Request, Response } from 'express';
import { Movie } from '../models/movie.model';
import { number } from 'zod';

export const listMovies = async (req: Request, res: Response) => {
    try {
        const { genre, mood, page = 1, limit = 20 } = req.query;

        const filter: Record<string, unknown> = {};

        if (genre) filter.genres = genre;
        if (mood) filter['scores.moods'] = mood;

        const skip = (Number(page) - 1) * Number(limit);

        const [movies, total] = await Promise.all([
            Movie.find(filter).skip(skip).limit(Number(limit)),
            Movie.countDocuments(filter),
        ]);

        res.json({
            movies,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies' });
    }
};

export const getMovie = async (req: Request, res: Response) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie' });
    }
};


export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { mood, energyLevel, timeAvailable } = req.body;

        const filter: Record<string, any> = {};

        if (mood) filter['scores.moods'] = mood;
        
        if (energyLevel) filter['scores.energyLevels'] = energyLevel;
        
        if (timeAvailable) filter.runtimeMinutes = { $lte: Number(timeAvailable) };

        const movies = await Movie.find(filter).limit(12);

        res.json(movies);
    } catch (err) {
        console.error('Error al procesar recomendaciones:', err);
        res.status(500).json({ message: 'Error al generar recomendaciones' });
    }
};
