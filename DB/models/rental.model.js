import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    status: {
        enum: ["available", "rented", "rejected"],
    },
    renterId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "RenterId is required"]
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: "Car",
        required: [true, "Car ID is required"]
    },
    from: {
        type: Date,
        required: [true, "Rental from date is required"]
    },
    to: {
        type: Date,
        required: [true, "Rental to date is required"]
    },
}, { timestamps: true }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;

rentalSchema.virtual('price').get(function () {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const numberOfDays = Math.round(Math.abs((this.to - this.from) / oneDay));
    const basePricePerDay = 50; // Replace with your actual base price per day
    return numberOfDays * basePricePerDay;
});