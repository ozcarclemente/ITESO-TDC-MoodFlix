import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export const AuthController = {
    
    googleCallback(req: Request, res: Response) {
        const user = req.user as IUser;

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000, // 24h en ms
        });

        res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
    },

    logout(req: Request, res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        res.status(200).json({ message: 'Sesión cerrada' });
    },
};