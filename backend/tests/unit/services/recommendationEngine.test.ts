import { scoreMovie } from '../../../src/services/recommendationEngine';
import { IMovie } from '../../../src/models/movie.model';

describe('recommendationEngine - scoreMovie', () => {
    const baseInput = {
        mood: 'happy',
        energyLevel: 'high',
        tensionTolerance: 'low',
        availableTime: 120,
        genreHint: []
    };

    const baseMovie = {
        genres: ['Action'],
        scores: {
            moods: ['happy'],
            energyLevels: ['high'],
            tensionLevels: ['low'],
        },
        runtimeMinutes: 100,
        ratingAvg: 8,
    } as unknown as IMovie;

    it('should add 5 points for a single genre match', () => {
        const input = { ...baseInput, genreHint: ['Action'] };
        const movie = { ...baseMovie, genres: ['Action', 'Comedy'] } as unknown as IMovie;
        
        // El puntaje base con coincidencias perfectas en humor, energía y tensión es:
        // Mood: 25, Energy: 20, Tension: 15, Runtime: 15, Quality: (8/10)*25 = 20.
        // Total base = 25+20+15+15+20 = 95.
        // Con 1 género coincidente: +5 = 100.
        
        const score = scoreMovie(movie, input);
        expect(score).toBe(100);
    });

    it('should add 10 points for two genre matches', () => {
        const input = { ...baseInput, genreHint: ['Action', 'Comedy'] };
        const movie = { ...baseMovie, genres: ['Action', 'Comedy', 'Drama'] } as unknown as IMovie;
        
        // Total base 95 + 10 = 105.
        const score = scoreMovie(movie, input);
        expect(score).toBe(105);
    });

    it('should add 15 points for three genre matches', () => {
        const input = { ...baseInput, genreHint: ['Action', 'Comedy', 'Drama'] };
        const movie = { ...baseMovie, genres: ['Action', 'Comedy', 'Drama'] } as unknown as IMovie;
        
        // Total base 95 + 15 = 110.
        const score = scoreMovie(movie, input);
        expect(score).toBe(110);
    });

    it('should cap genre points at 15 even with four matches', () => {
        const input = { ...baseInput, genreHint: ['Action', 'Comedy', 'Drama', 'Sci-Fi'] };
        const movie = { ...baseMovie, genres: ['Action', 'Comedy', 'Drama', 'Sci-Fi'] } as unknown as IMovie;
        
        // Total base 95 + 15 (cap) = 110.
        const score = scoreMovie(movie, input);
        expect(score).toBe(110);
    });

    it('should add 0 points if there are no genre matches', () => {
        const input = { ...baseInput, genreHint: ['Horror'] };
        const movie = { ...baseMovie, genres: ['Action', 'Comedy'] } as unknown as IMovie;
        
        // Total base 95 + 0 = 95.
        const score = scoreMovie(movie, input);
        expect(score).toBe(95);
    });
});
