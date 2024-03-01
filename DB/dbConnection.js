import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const mongoDB = process.env.DATABASE;
const dbConnection = async () => {
  try {
    await mongoose.connect(mongoDB);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed!");
  }
};

export default dbConnection;
