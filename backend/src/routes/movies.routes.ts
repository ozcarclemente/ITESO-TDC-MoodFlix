// server/routes/movies.ts

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { listMovies, getMovie, getRecommendations } from '../controllers/movies.controller';

const router = Router();

// GET /api/movies
router.get('/', authMiddleware, listMovies);

// POST /api/movies/recommendations 
router.post('/recommendations', authMiddleware, getRecommendations);

// GET /api/movies/:id
router.get('/:id', authMiddleware, getMovie);

export default router;