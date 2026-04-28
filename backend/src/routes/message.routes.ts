import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMessages, createMessage } from '../controllers/message.controller';

const router = Router();

router.get('/:movieId', authMiddleware, getMessages);

router.post('/', authMiddleware, createMessage);

export default router;
