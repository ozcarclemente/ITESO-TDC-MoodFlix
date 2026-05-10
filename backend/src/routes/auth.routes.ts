import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Google SSO
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  AuthController.googleCallback
);

router.post('/logout', AuthController.logout);

export default router;