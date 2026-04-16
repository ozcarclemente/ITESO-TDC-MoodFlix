// server/services/recommendationEngine.ts

import { Movie, IMovie } from '../models/movie.model';

interface QuestionnaireInput {
    mood: string;
    energyLevel: string;
    tensionTolerance: string;
    availableTime: 'short' | 'medium' | 'long';
    genreHint?: string[];
}

interface ScoredMovie {
    movie: IMovie;
    score: number;
}

const WEIGHTS = {
    mood: 40,
    energyLevel: 25,
    tensionTolerance: 20,
    availableTime: 15,
};

const TIME_MAP: Record<string, { min: number; max: number }> = {
    short: { min: 0, max: 90 },
    medium: { min: 91, max: 180 },
    long: { min: 181, max: Infinity },
};

function scoreMovie(movie: IMovie, input: QuestionnaireInput): number {
    let score = 0;

    if (movie.scores.moods.includes(input.mood)) {
        score += WEIGHTS.mood;
    }

    if (movie.scores.energyLevels.includes(input.energyLevel)) {
        score += WEIGHTS.energyLevel;
    }

    if (movie.scores.tensionLevels.includes(input.tensionTolerance)) {
        score += WEIGHTS.tensionTolerance;
    }

    const { min, max } = TIME_MAP[input.availableTime];
    if (movie.runtimeMinutes && movie.runtimeMinutes >= min && movie.runtimeMinutes <= max) {
        score += WEIGHTS.availableTime;
    }

    if (input.genreHint?.length) {
        const matchedGenres = movie.genres.filter(g => input.genreHint!.includes(g));
        const bonus = Math.min(matchedGenres.length * 10, 20);
        score += bonus;
    }

    return score;
}

export async function getRecommendations(
    input: QuestionnaireInput,
    limit = 10
): Promise<IMovie[]> {
    const movies = await Movie.find({ 'scores.moods': input.mood }).lean();

    const scored: ScoredMovie[] = movies
        .map(movie => ({ movie, score: scoreMovie(movie as IMovie, input) }))
        .sort((a, b) => b.score - a.score);

    const count = Math.min(Math.max(limit, 5), 15);
    return scored.slice(0, count).map(s => s.movie);
}