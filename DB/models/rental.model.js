import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
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
    finalPrice: {
        type: Number,
        required: [true, "Rental final price is required"]
    },
    status: {
        type: String,
        default: "pending",
        enum: ["paid", "pending", "cancelled"]
    },
    sessionId: {
        type: String,
    },
    invoice: {
        id: { type: String },
        url: { type: String }
    }
}, { timestamps: true }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;
