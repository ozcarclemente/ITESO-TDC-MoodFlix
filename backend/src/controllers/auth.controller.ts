import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { AuthService } from '../services/auth.service';

const generateToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
};

const setAuthCookie = (res: Response, token: string): void => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    });
};

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const { email, password, passwordConfirm, name } = req.body;

            if (!email || !password || !passwordConfirm || !name) {
                return res.status(400).json({ message: 'Campos requeridos faltantes' });
            }

            if (password !== passwordConfirm) {
                return res.status(400).json({ message: 'Las contraseñas no coinciden' });
            }

            if (password.length < 8) {
                return res.status(400).json({ message: 'Contraseña debe tener al menos 8 caracteres' });
            }

            const user = await AuthService.register(email, password, name);

            const token = generateToken(user);
            setAuthCookie(res, token);

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: { id: user._id, email: user.email, name: user.name, role: user.role },
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error en registro';
            res.status(400).json({ message });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña requeridos' });
            }

            const user = await AuthService.login(email, password);

            const token = generateToken(user);
            setAuthCookie(res, token);

            res.status(200).json({
                message: 'Sesión iniciada',
                user: { id: user._id, email: user.email, name: user.name, role: user.role },
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error en login';
            res.status(401).json({ message });
        }
    },

    googleCallback(req: Request, res: Response) {
        const user = req.user as IUser;

        const token = generateToken(user);
        setAuthCookie(res, token);

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