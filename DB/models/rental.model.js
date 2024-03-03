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
});
const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;


