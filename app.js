import express, { json, urlencoded } from 'express';
import { join,dirname } from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import productRouter from './routes/products.js';
import dotenv from 'dotenv';
import db from './config/db.js';

var app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products',productRouter)
app.use('/users', usersRouter);

const PORT = 5001;
app.listen(PORT,console.log(`server running on port ${PORT}`));
