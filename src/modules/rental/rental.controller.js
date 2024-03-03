import Rental from "../../../DB/models/rental.model.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { getAll, getOne } from "../controllers.factory.js";

export const getRecentTransactions = catchAsync(async (req, res, next) => {
    const recentTransactions = await Rental.find().sort({ createdAt: -1 }).limit(5);
    sendData(200, "success", "Recent Transactions fetched successfully", recentTransactions, res);
});

export const getAllTransactions = getAll(Rental);
export const getOneTransaction = getOne(Rental);