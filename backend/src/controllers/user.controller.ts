import { Response } from 'express';
import { User } from '../models/user.model';
import { UserWatched } from '../models/user-watched.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Playlist } from '../models/playlist.model';
import { PlaylistItem } from '../models/playlist-item.model';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId!).select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, photoUrl, birthDate } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId!,
            { name, photoUrl, birthDate },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const history = await UserWatched.find({ userId: req.userId })
            .populate('movieId', 'title poster releaseDate')
            .sort({ watchedAt: -1 });

        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};

export const addHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId } = req.body;

        const entry = await UserWatched.findOneAndUpdate(
            { userId: req.userId, movieId },
            { watchedAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ message: 'Error adding to history' });
    }
};

export const deleteHistory = async (req: AuthRequest, res: Response) => {
    try {
        await UserWatched.findOneAndDelete({
            userId: req.userId,
            movieId: req.params.movieId,
        });

        res.json({ message: 'Movie removed from history' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing from history' });
    }
};

export const saveRating = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId, rating } = req.body;

        const entry = await UserWatched.findOneAndUpdate(
            { userId: req.userId, movieId },
            {
                rating,
                $setOnInsert: { watchedAt: new Date() }
            },
            { upsert: true, new: true }
        );

        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ message: 'Error saving rating' });
    }
};

export const getRatings = async (req: AuthRequest, res: Response) => {
    try {
        const ratings = await UserWatched.find({
            userId: req.userId,
            rating: { $exists: true }
        }).select('movieId rating -_id');

        const formatted = Object.fromEntries(
            ratings.map((r: any) => [r.movieId.toString(), r.rating])
        );

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching ratings' });
    }
};


export const addFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId; 
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({ message: 'El ID de la película es requerido' });
        }

        // 1. Buscamos si el usuario ya tiene su lista de "Favoritos"
        let playlist = await Playlist.findOne({ userId, name: 'Ver más tarde' });

        // 2. Si no existe, la creamos al vuelo
        if (!playlist) {
            playlist = await Playlist.create({
                userId,
                name: 'Ver más tarde',
                description: 'Mis películas guardadas',
                isPublic: false
            });
        }

        // 3. Intentamos agregar la película a la lista
        try {
            await PlaylistItem.create({
                playlistId: playlist._id,
                movieId: movieId
            });
            res.status(201).json({ message: 'Película agregada a favoritos con éxito' });
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'La película ya está en tu lista de favoritos' });
            }
            throw error;
        }

    } catch (err) {
        console.error('Error al agregar a favoritos:', err);
        res.status(500).json({ message: 'Error interno del servidor al guardar favorito' });
    }
};


export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        const playlist = await Playlist.findOne({ userId, name: 'Ver más tarde' });

        if (!playlist) {
            return res.json([]); 
        }

        const items = await PlaylistItem.find({ playlistId: playlist._id })
            .populate('movieId')
            .sort({ addedAt: -1 });

        const movies = items.map(item => item.movieId);

        res.json(movies);
    } catch (err) {
        console.error('Error al obtener lista "Ver más tarde"', err);
        res.status(500).json({ message: 'Error interno del servidor al leer "Ver más tarde"' });
    }
};

export const deleteFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { movieId } = req.params; 

        const playlist = await Playlist.findOne({ userId, name: 'Ver más tarde' });

        if (!playlist) {
            return res.status(404).json({ message: 'Lista de "Ver más tarde" no encontrada' });
        }

        await PlaylistItem.findOneAndDelete({
            playlistId: playlist._id,
            movieId: movieId
        });

        res.json({ message: 'Película removida de tu lista' });
    } catch (err) {
        console.error('Error al eliminar de "Ver más tarde":', err);
        res.status(500).json({ message: 'Error interno del servidor al eliminar de "Ver más tarde"' });
    }
};