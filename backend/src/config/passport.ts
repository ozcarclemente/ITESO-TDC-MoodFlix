import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

export const initPassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await AuthService.findOrCreate({
                        googleSub: profile.id,              // profile.id es el "sub" de Google
                        email: profile.emails![0].value,
                        name: profile.displayName,
                        photoUrl: profile.photos?.[0]?.value,
                    });
                    return done(null, user);
                } catch (error) {
                    return done(error as Error);
                }
            }
        )
    );
};