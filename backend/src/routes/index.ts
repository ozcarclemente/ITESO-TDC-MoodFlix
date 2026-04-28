import { Router } from 'express';
import AuthRouter from './auth.routes';
import MoviesRouter from './movies.routes';
import UserRouter from './user.routes';
import MessageRouter from './message.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/movies', MoviesRouter);
router.use('/user', UserRouter);
router.use('/messages', MessageRouter);

export default router;