// server/routes/movies.ts

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { listMovies, getMovie } from '../controllers';

const router = Router();

// GET /api/movies
router.get('/', authMiddleware, listMovies);

// GET /api/movies/:id
router.get('/:id', authMiddleware, getMovie);

export default router;