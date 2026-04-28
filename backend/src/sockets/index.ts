import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';

function parseCookie(str: string): Record<string, string> {
    return str.split(';').reduce((acc, pair) => {
        const [k, v] = pair.trim().split('=');
        if (k) acc[k] = decodeURIComponent(v ?? '');
        return acc;
    }, {} as Record<string, string>);
}

export function initSockets(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const cookieHeader = socket.handshake.headers.cookie ?? '';
        const token = parseCookie(cookieHeader)['token'];

        if (!token) {
            return next(new Error('No token'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            socket.data.userId = decoded.id;
            next();
        } catch {
            next(new Error('Token inválido'));
        }
    });

    io.on('connection', (socket) => {
        socket.on('join-room', (movieId: string) => {
            socket.join(`movie:${movieId}`);
        });

        socket.on('load-messages', async (movieId: string) => {
            try {
                const messages = await Message.find({ movieId })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .lean();
                socket.emit('messages-history', messages.reverse());
            } catch (err) {
                socket.emit('error', { message: 'Error loading messages' });
            }
        });

        socket.on('send-message', async (data: { movieId: string; username: string; content: string }) => {
            try {
                if (!data.content?.trim() || data.content.length > 500 || !data.movieId) {
                    return;
                }

                const user = await User.findById(socket.data.userId).select('photoUrl').lean();

                const msg = await Message.create({
                    movieId: data.movieId,
                    userId: socket.data.userId,
                    username: data.username,
                    content: data.content.trim(),
                    userPhotoUrl: user?.photoUrl || undefined,
                });

                io.to(`movie:${data.movieId}`).emit('new-message', msg);
            } catch (err) {
                socket.emit('error', { message: 'Error sending message' });
            }
        });

        socket.on('disconnect', () => {});
    });
}
