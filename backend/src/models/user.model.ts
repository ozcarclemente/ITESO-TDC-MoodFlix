import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleSub: string;
    email: string;
    name: string;
    photoUrl?: string;
    birthDate?: Date;
    role: 'USER' | 'CURATOR';
    lastQuestionnaireId?: mongoose.Types.ObjectId;
    watchedMoviesRecommendation: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        googleSub: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        photoUrl: { type: String },
        birthDate: { type: Date },
        role: { type: String, enum: ['USER', 'CURATOR'], default: 'USER' },
        lastQuestionnaireId: { type: Schema.Types.ObjectId, ref: 'Questionnaire' },
        watchedMoviesRecommendation: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);