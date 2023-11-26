import express, { json, urlencoded } from 'express';
import { join,dirname } from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
// import imagesRouter from './routes/images.js';
import dotenv from 'dotenv';
import db from './config/db.js';
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
import mongoose from 'mongoose';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51OCS11C7JotVMvT6L376SPGGAfa0FotXnyt43iIPAoI27K1iBEBT850v72NTDrbBo8ExzAczCzXFgp1ca8zaQ41N008FSo82ob")



var app = express();



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gfs = new mongoose.mongo.GridFSBucket(db,{bucketName:'proshop'});


dotenv.config()

app.use(logger('dev'));
// Body parser middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/products',productRouter)
app.use('/api/users', usersRouter);
app.use('/api/orders',orderRouter);
app.use('/api/image/:filename', function(req, res, next) {
 
    gfs.find({ filename: req.params.filename }).toArray((err, file) => {
        if(err){
            console.log(err);
        }
        // if the filename exist in database
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'no files exist'
            });
        }

        // creating stream to read the image which is stored in chunks 
        const readStream = gfs.openDownloadStreamByName(file[0].filename);
        // this is will display the image directly
        readStream.pipe(res);
    })
   
});



app.use(notFound);
app.use(errorHandler);

const PORT = 5001;
app.listen(PORT,console.log(`server running on port ${PORT}`));
