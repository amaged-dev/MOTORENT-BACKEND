import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/MOTORENT');
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed!");
    }
};


export default dbConnection;