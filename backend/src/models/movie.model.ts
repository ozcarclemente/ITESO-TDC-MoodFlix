import { Schema, model, Document } from 'mongoose';

export interface IMovieScores {
    moods: string[];
    energyLevels: string[];
    tensionLevels: string[];
}

export interface IMovie extends Document {
    tmdbId: number;
    title: string;
    genres: string[];
    releaseYear?: number;
    runtimeMinutes?: number;
    ratingAvg?: number;
    posterUrl?: string;
    overview?: string;
    scores: IMovieScores;
    fetchedAt: Date;
    ageRating?: string;
    providers?: string[]; 
}

const movieSchema = new Schema<IMovie>({
    tmdbId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    genres: [{ type: String }],
    releaseYear: { type: Number },
    runtimeMinutes: { type: Number },
    ratingAvg: { type: Number },
    posterUrl: { type: String },
    overview: { type: String },
    scores: {
        moods: [{ type: String }],
        energyLevels: [{ type: String }],
        tensionLevels: [{ type: String }],
    },
    fetchedAt: { type: Date, default: Date.now },
    ageRating: { type: String },
});

export const Movie = model<IMovie>('Movie', movieSchema);