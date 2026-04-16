import { Schema, model, Document, Types } from 'mongoose';

export interface IQuestionnaire extends Document {
    userId: Types.ObjectId;
    mood: string;
    energyLevel: string;
    tensionTolerance: string;
    availableTime: string; // 'short' | 'medium' | 'long'
    genreHint?: string[];
    createdAt: Date;
}

const questionnaireSchema = new Schema<IQuestionnaire>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        mood: { type: String, required: true },
        energyLevel: { type: String, required: true },
        tensionTolerance: { type: String, required: true },
        availableTime: { type: String, required: true },
        genreHint: [{ type: String }],
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

questionnaireSchema.index({ userId: 1, createdAt: -1 });

export const Questionnaire = model<IQuestionnaire>('Questionnaire', questionnaireSchema);