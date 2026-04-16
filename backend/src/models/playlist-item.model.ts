import { Schema, model, Document, Types } from 'mongoose';

export interface IPlaylistItem extends Document {
    playlistId: Types.ObjectId;
    movieId: Types.ObjectId;
    order?: number;
    addedAt: Date;
}

const playlistItemSchema = new Schema<IPlaylistItem>({
    playlistId: { type: Schema.Types.ObjectId, ref: 'Playlist', required: true },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    order: { type: Number },
    addedAt: { type: Date, default: Date.now },
});

playlistItemSchema.index({ playlistId: 1, movieId: 1 }, { unique: true });
playlistItemSchema.index({ playlistId: 1, order: 1 });

export const PlaylistItem = model<IPlaylistItem>('PlaylistItem', playlistItemSchema);