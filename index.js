import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import server from './server.js';
import db from './db.js';
import { movieRoute, personRoute } from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

//starting server
server(app);

app.use('/movie', movieRoute);
app.use('/person', personRoute);
