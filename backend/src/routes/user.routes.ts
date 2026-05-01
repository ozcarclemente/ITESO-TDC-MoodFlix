// server/routes/user.ts
import multer from 'multer';
import { uploadAvatar } from '../controllers/user.controller';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getMe,
    getProfile,
    updateProfile,
    getHistory,
    addHistory,
    deleteHistory,
    saveRating,
    getRatings,
    addFavorite,
    getFavorites,
    deleteFavorite
} from '../controllers';

const router = Router();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite estricto de 5MB por seguridad
});

router.get('/me', authMiddleware, getMe);

router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);

router.post('/favorites', authMiddleware, addFavorite);
router.get('/favorites', authMiddleware, getFavorites);
router.delete('/favorites/:movieId', authMiddleware, deleteFavorite);

router.get('/history', authMiddleware, getHistory);
router.post('/history', authMiddleware, addHistory);
router.delete('/history/:movieId', authMiddleware, deleteHistory);

router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

router.post('/ratings', authMiddleware, saveRating);
router.get('/ratings', authMiddleware, getRatings);

export default router;