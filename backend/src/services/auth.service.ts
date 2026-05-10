import { User, IUser } from '../models/user.model';

interface GoogleProfile {
    googleSub: string;
    email: string;
    name: string;
    photoUrl?: string;
}

export const AuthService = {
    async findOrCreate(profile: GoogleProfile): Promise<IUser> {
        let user = await User.findOne({ email: profile.email });

        if (!user) {
            user = await User.create(profile);
        } else if (!user.googleSub) {
            user.googleSub = profile.googleSub;
            await user.save();
        }

        return user;
    },

    async register(email: string, password: string, name: string): Promise<IUser> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email ya registrado');
        }

        const user = await User.create({
            email,
            password,
            name,
            role: 'USER',
        });

        return user;
    },

    async login(email: string, password: string): Promise<IUser> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email o contraseña inválidos');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Email o contraseña inválidos');
        }

        return user;
    },

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (!user.password) {
            throw new Error('Usuario registrado con Google. No puedes cambiar contraseña.');
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error('Contraseña actual inválida');
        }

        user.password = newPassword;
        await user.save();
    },
};