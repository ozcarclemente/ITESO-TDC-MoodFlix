import { User, IUser } from '../models/user.model';

interface GoogleProfile {
    googleSub: string;
    email: string;
    name: string;
    photoUrl?: string;
}

export const AuthService = {
    async findOrCreate(profile: GoogleProfile): Promise<IUser> {
        let user = await User.findOne({ googleSub: profile.googleSub });

        if (!user) {
            user = await User.create(profile);
        }

        return user;
    },
};