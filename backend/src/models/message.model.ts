import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    movieId: string;
    userId: string;
    username: string;
    content: string;
    userPhotoUrl?: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        movieId: { type: String, required: true, index: true },
        userId: { type: String, required: true },
        username: { type: String, required: true },
        content: { type: String, required: true, maxlength: 500 },
        userPhotoUrl: { type: String, required: false },
    },
    { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
