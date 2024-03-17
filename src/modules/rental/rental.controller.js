import Car from "../../../DB/models/car.model.js";
import Rental from "../../../DB/models/rental.model.js";
import User from "../../../DB/models/user.model.js";
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
    req.body.renterId = req.user._id;
    // check car existence
    const carExist = await Car.findById(req.body.car);
    if (!carExist) {
        return next(new AppError("Car not found", 404));
    }
    // check if the car status is available
    const carAvailable = await Car.findById(req.body.car);
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

    // update car status
    await Car.findByIdAndUpdate(req.body.car, { status: "rented" }, { new: true });
    await User.findByIdAndUpdate(req.user._id, { $push: { rentedCars: carExist._id } }, { new: true });

    sendData(201, "success", "Rental created successfully", rental, res);
});

export const getMyRentals = catchAsync(async (req, res, next) => {
    const myRentals = await Rental.find({ renterId: req.user.id });
    if (!myRentals.length) {
        return next(new AppError("No rentals found for this user", 404));
    }
    sendData(200, "success", "My rentals fetched successfully", myRentals, res);
});

// top 5 categories by rent
export const getTopCategories = catchAsync(async (req, res, next) => {
    const topCategories = await Rental.aggregate([
        {
            $lookup: {
                from: "cars", // the name of the Car collection
                localField: "car",
                foreignField: "_id",
                as: "car"
            }
        },
        {
            $unwind: "$car"
        },
        {
            $group: {
                _id: "$car.category", // group by category
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1
            }
        }
    ]);
    sendData(200, "success", "Top categories fetched successfully", topCategories, res);
});
// top 5 cars by rent and return the full car info
export const getTopCars = catchAsync(async (req, res, next) => {
    const topCars = await Rental.aggregate([
        {
            $group: {
                _id: "$car",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "cars", // the name of the Car collection
                localField: "_id",
                foreignField: "_id",
                as: "car"
            }
        },
        {
            $unwind: "$car"
        },
        {
            $lookup: {
                from: "brands", // the name of the Brand collection
                localField: "car.brand",
                foreignField: "_id",
                as: "car.brand"
            }
        },
        {
            $unwind: "$car.brand"
        },
        {
            $project: {
                'car.__v': 0,
                'car.brand.__v': 0,
                'car.cloudFolder': 0,
                'car.createdAt': 0,
                'car.updatedAt': 0,
            }
        },
    ]);
    sendData(200, "success", "Top cars fetched successfully", topCars, res);
});
// // top cars by rent descending
// export const getTopCarsByRent = catchAsync(async (req, res, next) => {
//     const topCars = await Rental.aggregate([
//         {
//             $group: {
//                 _id: "$car",
//                 count: { $sum: 1 }
//             }
//         },
//         {
//             $sort: { count: -1 }
//         },
//         {
//             $lookup: {
//                 from: "cars", // the name of the Car collection
//                 localField: "_id",
//                 foreignField: "_id",
//                 as: "car"
//             }
//         },
//         {
//             $unwind: "$car"
//         },
//         {
//             $project: {
//                 'car.__v': 0,
//                 'car.brand.__v': 0,
//                 'car.cloudFolder': 0,
//                 'car.createdAt': 0,
//                 'car.updatedAt': 0,
//             }
//         },
//     ]);
//     sendData(200, "success", "Top cars by rent fetched successfully", topCars, res);
// });

export const getTopCarsByRent = catchAsync(async (req, res, next) => {
    const topCars = await Rental.aggregate([
        {
            $group: {
                _id: {
                    car: "$car",
                    rental: "$_id"
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $lookup: {
                from: "cars",
                localField: "_id.car",
                foreignField: "_id",
                as: "car"
            }
        },
        {
            $unwind: "$car"
        },
        {
            $project: {
                'car.__v': 0,
                'car.brand.__v': 0,
                'car.cloudFolder': 0,
                'car.createdAt': 0,
                'car.updatedAt': 0,
            }
        },
    ]);
    sendData(200, "success", "Top cars by rent fetched successfully", topCars, res);
});

export const platformRevenue = catchAsync(async (req, res, next) => {
    const revenue = await Rental.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$finalPrice" }
            }
        },
        {
            $project: {
                _id: 0,
                revenue: { $multiply: ["$total", 0.20] }
            }
        }
    ]);

    sendData(200, "success", "Platform Revenue fetched successfully", revenue, res);
});

// ====
// Function to calculate daily revenue considering platform commission
export const calculateMonthlyRevenue = catchAsync(async (req, res, next) => {
    const year = req.query?.year?.replace(/\D/g, ''); // Extract only digits from the parameter

    if (!year || isNaN(year)) {
        return res.status(400).json({ status: "error", message: "Invalid year parameter" });
    }

    try {
        // Construct the start and end dates of the given year in the local time zone
        const startOfYear = new Date(Number(year), 0, 1); // January 1st of the given year
        const endOfYear = new Date(Number(year), 11, 31, 23, 59, 59); // December 31st of the given year

        // Aggregate to calculate total revenue for each month of the year
        const monthlyRevenue = await Rental.aggregate([
            {
                $match: {
                    from: { $gte: startOfYear, $lte: endOfYear } // Filter rentals within the given year
                }
            },
            {
                $project: {
                    month: { $month: { date: "$from", timezone: "UTC" } }, // Extract month from 'from' date in UTC
                    platformCommission: { $multiply: ["$finalPrice", 0.2] }, // Calculate platform commission (20%)
                    netRevenue: { $subtract: ["$finalPrice", { $multiply: ["$finalPrice", 0.2] }] } // Calculate net revenue
                }
            },
            {
                $group: {
                    _id: { month: "$month" }, // Group by month
                    totalRevenue: { $sum: "$netRevenue" } // Sum of net revenue for each month
                }
            }
        ]);

        // Convert the resulting array to an object with month number as keys
        const monthlyRevenueObj = {};
        monthlyRevenue.forEach(item => {
            monthlyRevenueObj[item._id.month] = item.totalRevenue;
        });

        // Prepare response data with month names
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const result = months.map((monthName, index) => ({
            _id: { month: index + 1, monthName },
            totalRevenue: monthlyRevenueObj[index + 1] || 0
        }));

        sendData(200, "success", "Monthly revenue fetched successfully", result, res);
    } catch (error) {
        console.error("Error occurred while calculating monthly revenue:", error);
        sendData(500, "error", "An error occurred while calculating monthly revenue", null, res);
    }
});



// ====




const populateObj = [
    {
        path: "car",
        select: "-__v -id",
    },
];

export const getAllRentals = getAll(Rental, populateObj);
export const getOneRental = getOne(Rental, populateObj);
export const deleteOneRental = deleteOne(Rental);