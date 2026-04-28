import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initPassport } from './config/passport';
import { initSockets } from './sockets';
import router from './routes';


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

initPassport();
app.use(passport.initialize());

app.use('/api', router);

const httpServer = createServer(app);
initSockets(httpServer);

mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
        console.log('MongoDB conectado');
        httpServer.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    })
    .catch((err) => {
        console.error('Error conectando MongoDB:', err);
        process.exit(1);
    });