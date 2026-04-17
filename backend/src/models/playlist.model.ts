import { Schema, model, Document, Types } from 'mongoose';

export interface IPlaylist extends Document {
    userId: Types.ObjectId; 
    name: string;
    description?: string;
    isPublic: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const playlistSchema = new Schema<IPlaylist>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        description: { type: String },
        isPublic: { type: Boolean, default: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);


// Un usuario no puede tener dos listas llamadas "Favoritos", 
// pero diferentes usuarios sí pueden tener su propia lista "Favoritos".
playlistSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Playlist = model<IPlaylist>('Playlist', playlistSchema);