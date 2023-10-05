import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

console.log(process.env.MONGO_URI);

var gfs;
const connectDB = async () => {
    try {
        var conn = await mongoose.connect(process.env.MONGO_URI);
       
        console.log(`MongoDB Connected:${conn.connection.host}`)
    }
    catch (error) {
        console.log(`Error : ${error.message}`)
        process.exit(1)
    }
    return conn.connection.db


}


var db = await Promise.resolve(connectDB());

export default db;