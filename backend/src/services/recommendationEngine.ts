// server/services/recommendationEngine.ts

import { Movie, IMovie } from '../models/movie.model';

interface QuestionnaireInput {
    mood: string;
    energyLevel: string;
    tensionTolerance: string;
    availableTime: number;
    genreHint?: string[];
}

interface ScoredMovie {
    movie: IMovie;
    score: number;
}

const WEIGHTS = {
    mood: 25,
    energyLevel: 20,
    tensionTolerance: 15,
    availableTime: 15,
    quality: 25,
};

function scoreMovie(movie: IMovie, input: QuestionnaireInput): number {
    let score = 0;

    if (!movie.scores?.moods?.length) {
        return 0;
    }

    if (movie.scores.moods.includes(input.mood)) {
        score += WEIGHTS.mood;
    }

    if (movie.scores.energyLevels.includes(input.energyLevel)) {
        score += WEIGHTS.energyLevel;
    }

    if (movie.scores.tensionLevels.includes(input.tensionTolerance)) {
        score += WEIGHTS.tensionTolerance;
    }

    if (movie.runtimeMinutes && movie.runtimeMinutes >= input.availableTime * 0.8 && movie.runtimeMinutes <= input.availableTime * 1.2) {
        score += WEIGHTS.availableTime;
    }

    if (input.genreHint?.length) {
        const matchedGenres = movie.genres.filter(g => input.genreHint!.includes(g));
        score += Math.min(matchedGenres.length * 5, 15);
    }

    const ratingScore = ((movie.ratingAvg || 5) / 10) * WEIGHTS.quality;
    score += ratingScore;

    return score;
}

export async function getRecommendations(
    input: QuestionnaireInput,
    limit = 10
): Promise<IMovie[]> {
    const movies = await Movie.find().lean();

    const scored: ScoredMovie[] = movies
        .map(movie => ({ movie, score: scoreMovie(movie as IMovie, input) }))
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score);

    const topSubset = scored.slice(0, Math.min(limit * 3, scored.length));

    for (let i = topSubset.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [topSubset[i], topSubset[j]] = [topSubset[j], topSubset[i]];
    }

    const count = Math.max(Math.min(limit, 20), 1);
    return topSubset.slice(0, count).map(s => s.movie);
}