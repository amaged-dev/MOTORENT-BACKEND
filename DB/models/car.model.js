import mongoose from "mongoose";

const carSchema = new mongoose.Schema({});

const Car = mongoose.model("Car", carSchema);

export default Car;
