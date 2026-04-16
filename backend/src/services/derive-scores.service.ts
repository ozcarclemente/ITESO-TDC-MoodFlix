// services/deriveScores.ts

type EnergyLevel = 'low' | 'medium' | 'high';
type TensionLevel = 'none' | 'low' | 'medium' | 'high';
type Mood = 'happy' | 'sad' | 'tense' | 'excited' | 'romantic' | 'bored' | 'nostalgic' | 'curious';

interface MovieScores {
    moods: Mood[];
    energyLevels: EnergyLevel[];
    tensionLevels: TensionLevel[];
}

const GENRE_MOODS: Record<string, Mood[]> = {
    Action: ['excited', 'tense'],
    Adventure: ['excited'],
    Animation: ['happy', 'nostalgic'],
    Comedy: ['happy'],
    Crime: ['tense', 'curious'],
    Documentary: ['curious'],
    Drama: ['sad', 'nostalgic'],
    Family: ['happy', 'nostalgic'],
    Fantasy: ['excited', 'curious'],
    History: ['curious', 'nostalgic'],
    Horror: ['tense'],
    Music: ['happy', 'nostalgic'],
    Mystery: ['curious', 'tense'],
    Romance: ['romantic', 'sad'],
    'Science Fiction': ['curious', 'excited'],
    Thriller: ['tense', 'excited'],
    War: ['tense', 'sad'],
    Western: ['excited'],
};

const GENRE_ENERGY: Record<string, EnergyLevel> = {
    Action: 'high',
    Adventure: 'high',
    Horror: 'high',
    Thriller: 'high',
    War: 'high',
    Crime: 'medium',
    Drama: 'medium',
    Fantasy: 'medium',
    History: 'medium',
    Music: 'medium',
    Mystery: 'medium',
    Romance: 'medium',
    'Science Fiction': 'medium',
    Western: 'medium',
    Animation: 'low',
    Comedy: 'low',
    Documentary: 'low',
    Family: 'low',
};

const GENRE_TENSION: Record<string, TensionLevel> = {
    Horror: 'high',
    Thriller: 'high',
    War: 'high',
    Action: 'medium',
    Crime: 'medium',
    Mystery: 'medium',
    Western: 'medium',
    Adventure: 'low',
    Drama: 'low',
    Fantasy: 'low',
    History: 'low',
    'Science Fiction': 'low',
    Comedy: 'none',
    Animation: 'none',
    Documentary: 'none',
    Family: 'none',
    Music: 'none',
    Romance: 'none',
};

export function deriveScores(genres: string[], ratingAvg?: number): MovieScores {
    const moodsSet = new Set<Mood>();
    const energySet = new Set<EnergyLevel>();
    const tensionSet = new Set<TensionLevel>();

    for (const genre of genres) {
        GENRE_MOODS[genre]?.forEach(m => moodsSet.add(m));
        if (GENRE_ENERGY[genre]) energySet.add(GENRE_ENERGY[genre]);
        if (GENRE_TENSION[genre]) tensionSet.add(GENRE_TENSION[genre]);

        if (genre === 'Thriller' && ratingAvg && ratingAvg > 7) {
            tensionSet.add('high');
        }
    }

    if (ratingAvg && ratingAvg >= 7.5) {
        moodsSet.add('bored');
    }

    return {
        moods: Array.from(moodsSet),
        energyLevels: Array.from(energySet),
        tensionLevels: Array.from(tensionSet),
    };
}