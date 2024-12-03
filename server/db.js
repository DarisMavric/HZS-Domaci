import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config()

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected: ',connect.connection.host,connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;