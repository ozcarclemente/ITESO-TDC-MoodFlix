import { Router } from 'express';
import AuthRouter from './auth.routes';
import MoviesRouter from './movies.routes'; 
import UserRouter from './user.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/movies', MoviesRouter);
router.use('/user', UserRouter); 

export default router;