import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    googleSub?: string;
    email: string;
    name: string;
    password?: string;
    photoUrl?: string;
    birthDate?: Date;
    role: 'USER' | 'CURATOR';
    lastQuestionnaireId?: mongoose.Types.ObjectId;
    watchedMoviesRecommendation: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        googleSub: { type: String, default: undefined },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String },
        photoUrl: { type: String },
        birthDate: { type: Date },
        role: { type: String, enum: ['USER', 'CURATOR'], default: 'USER' },
        lastQuestionnaireId: { type: Schema.Types.ObjectId, ref: 'Questionnaire' },
        watchedMoviesRecommendation: { type: Boolean, default: false },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
    } catch (error) {
        throw error;
    }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password || '');
};

export const User = mongoose.model<IUser>('User', UserSchema);