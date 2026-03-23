import express from 'express';
import passport from 'passport';
import { initPassport } from './config/passport';
import router from './routes';

const app = express();

initPassport();
app.use(passport.initialize());

app.use('/api', router);