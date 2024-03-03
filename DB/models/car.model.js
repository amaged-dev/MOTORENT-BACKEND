import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Car owner is required"],
    },
    manufacturingYear: {
      type: Number,
      required: [true, "Car manufacturingYear is required"],
    },
    model: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Car brandId is required"],
      ref: "Brand",
    },
    category: {
      enum: ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon"],
      required: [true, "Car category is required"],
      default: "Sedan",
    },
    tankCapacity: {
      type: Number,
      required: [true, "Car tankCapacity is required"],
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
      city: { type: String, required: [true, "city is required"] },
      area: { type: String, required: [true, "area is required"] },
      description: { type: String },
    },
    totalKM: {
      type: Number,
      default: 0,
    },
    plateNumber: {
      type: String,
      required: [true, "Please Enter car palate number"],
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
