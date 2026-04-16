import { Router } from 'express';
import AuthRouter from './auth.routes';
import MoviesRouter from './movies.routes'; 

const router = Router();

router.use('/auth', AuthRouter);
router.use('/movies', MoviesRouter);

export default router;