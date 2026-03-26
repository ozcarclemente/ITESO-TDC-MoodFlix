import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Inicia el flujo con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google regresa aquí después de autenticar
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  AuthController.googleCallback
);

router.post('/logout', AuthController.logout);

export default router;