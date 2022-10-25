import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db.js';
import server from './server.js';
import {
  movieRoute,
  personRoute,
  authRoute,
  userRoute,
} from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://xemphim-clone.vercel.app',
    credentials: true,
  })
);

//starting server
server(app);

app.use('/movie', movieRoute);
app.use('/person', personRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
