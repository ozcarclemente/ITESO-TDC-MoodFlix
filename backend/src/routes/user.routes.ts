// server/routes/user.ts

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getProfile,
    updateProfile,
    getHistory,
    addHistory,
    deleteHistory,
    saveRating,
    getRatings,
} from '../controllers';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);

router.get('/history', authMiddleware, getHistory);
router.post('/history', authMiddleware, addHistory);
router.delete('/history/:movieId', authMiddleware, deleteHistory);

router.post('/ratings', authMiddleware, saveRating);
router.get('/ratings', authMiddleware, getRatings);

export default router;