import { Schema, model, Document } from 'mongoose';

export interface IPlaylist extends Document {
    name: string;
    description?: string;
    isPublic: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const playlistSchema = new Schema<IPlaylist>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        isPublic: { type: Boolean, default: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

export const Playlist = model<IPlaylist>('Playlist', playlistSchema);