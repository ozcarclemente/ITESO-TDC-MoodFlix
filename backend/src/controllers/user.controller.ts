import { Response } from 'express';
import { User } from '../models/user.model';
import { UserWatched } from '../models/user-watched.model';
import { AuthRequest } from '../middlewares/auth.middleware';

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
