import { Response } from 'express';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        if (!movieId) {
            return res.status(400).json({ message: 'movieId required' });
        }

        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 50));
        const skip = (pageNum - 1) * limitNum;

        const [messages, total] = await Promise.all([
            Message.find({ movieId }).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            Message.countDocuments({ movieId }),
        ]);

        res.json({
            messages: messages.reverse(),
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId, username, content } = req.body;
        const userId = req.userId;

        if (!movieId || !movieId.trim()) {
            return res.status(400).json({ message: 'movieId required' });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'content required' });
        }

        if (content.length > 500) {
            return res.status(400).json({ message: 'content max 500 characters' });
        }

        if (!username || !username.trim()) {
            return res.status(400).json({ message: 'username required' });
        }

        const user = await User.findById(userId).select('photoUrl').lean();

        const message = await Message.create({
            movieId: movieId.trim(),
            userId,
            username: username.trim(),
            content: content.trim(),
            userPhotoUrl: user?.photoUrl || undefined,
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: 'Error creating message' });
    }
};
