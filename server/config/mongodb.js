// config/mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("Database Connected");
    })

    // await mongoose.connect(`${process.env.MONGODB_URI}/MERN_ArtifyAI`)
    await mongoose.connect(process.env.MONGODB_URI);
}

export default connectDB;