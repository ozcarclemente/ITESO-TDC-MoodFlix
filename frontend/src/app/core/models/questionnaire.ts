export type Mood = 'happy' | 'sad' | 'tense' | 'excited' | 'romantic' | 'bored' | 'nostalgic' | 'curious';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface QuestionnaireAnswers {
  mood: Mood;
  energyLevel: EnergyLevel;
  timeAvailable: number;
}