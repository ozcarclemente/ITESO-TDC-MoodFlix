import { Schema, model, Document, Types } from 'mongoose';

export interface IUserWatched extends Document {
    userId: Types.ObjectId;
    movieId: Types.ObjectId;
    rating?: number;
    watchedAt: Date;
}

const userWatchedSchema = new Schema<IUserWatched>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    rating: { type: Number, min: 1, max: 5 },
    watchedAt: { type: Date, default: Date.now },
});

userWatchedSchema.index({ userId: 1, movieId: 1 }, { unique: true });
userWatchedSchema.index({ userId: 1, watchedAt: -1 });

export const UserWatched = model<IUserWatched>('UserWatched', userWatchedSchema);