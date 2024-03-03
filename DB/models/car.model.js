import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Car owner is required"],
    },
    name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Car category is required"],
      trim: true,
    },
    tankCapacity: {
      type: Number,
      required: [true, "Car tank capacity is required"],
    },
    average: {
      type: Number,
      required: [true, "Car average KM is required"],
    },
    transmission: {
      enum: ["auto", "manual"],
    },
    capacity: {
      type: Number,
      required: [true, "Car capacity is required"],
    },
    isRented: {
      type: Boolean,
      default: false,
    },
    priceForDay: {
      type: Number,
      required: [true, "Car price for day is required"],
    },
    location: {
      type: String,
      required: [true, "Please Enter car location"],
    },
    totalKM: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
