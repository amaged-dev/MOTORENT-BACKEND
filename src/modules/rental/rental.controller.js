import Car from "../../../DB/models/car.model.js";
import Rental from "../../../DB/models/rental.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { deleteOne, getAll, getOne } from "../controllers.factory.js";

export const getRecentRentals = catchAsync(async (req, res, next) => {
    const recentTransactions = await Rental.find().sort({ createdAt: -1 }).limit(5);
    sendData(200, "success", "Recent Transactions fetched successfully", recentTransactions, res);
});

export const getRentalsByUserId = catchAsync(async (req, res, next) => {
    const transactions = await Rental.find({ renterId: req.params.id });
    if (!transactions.length) {
        return next(new AppError("No transactions found for this car", 404));
    }
    sendData(200, "success", "Transactions fetched successfully", transactions, res);
});

export const getRentalsByCarId = catchAsync(async (req, res, next) => {
    const transactions = await Rental.find({ car: req.params.id });
    if (!transactions.length) {
        return next(new AppError("No transactions found for this car", 404));
    }
    sendData(200, "success", "Transactions fetched successfully", transactions, res);
});

export const getRentalsByDate = catchAsync(async (req, res, next) => {
    const transactions = await Rental.find({ from: { $gte: req.body.from }, to: { $lte: req.body.to } });
    if (!transactions.length) {
        return next(new AppError("No transactions found for this date", 404));
    }
    sendData(200, "success", "Transactions fetched successfully", transactions, res);
});

export const createRental = catchAsync(async (req, res, next) => {
    // check car existence
    const carExist = await Car.findById(req.body.carId);
    if (!carExist) {
        return next(new AppError("Car not found", 404));
    }
    // check if the car is available
    const carAvailable = await Car.findById(req.body.carId);
    if (carAvailable.status !== "available") {
        return next(new AppError("Car not available right now", 404));
    }

    const from = new Date(req.body.from);
    const to = new Date(req.body.to);

    // Calculate the difference in milliseconds and then convert it to days
    const differenceInTime = to.getTime() - from.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Calculate the price
    const price = differenceInDays * carExist.priceForDay;
    req.body.finalPrice = price;
    const rental = await Rental.create(req.body);
    sendData(201, "success", "Rental created successfully", rental, res);
});

export const getMyRentals = catchAsync(async (req, res, next) => {
    const myRentals = await Rental.find({ renterId: req.user.id });
    if (!myRentals.length) {
        return next(new AppError("No rentals found for this user", 404));
    }
    sendData(200, "success", "My rentals fetched successfully", myRentals, res);
});

export const getAllRentals = getAll(Rental);
export const getOneRental = getOne(Rental);
export const deleteOneRental = deleteOne(Rental);