import path from 'path';
import Stripe from "stripe";
import { fileURLToPath } from "url";
import Car from "../../../DB/models/car.model.js";
import Rental from "../../../DB/models/rental.model.js";
import User from "../../../DB/models/user.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { createInvoice } from "../../utils/pdfTemplate.js";
import { sendData } from "../../utils/sendData.js";
import { deleteOne, getAll, getOne } from "../controllers.factory.js";
import { nanoid } from 'nanoid';
import cloudinary from './../../utils/cloud.js';
import fs from 'fs';
import sendEmail from '../../utils/email.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
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


    // create the payment with stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:5173/rentalInfo/payres/${rental._id}`,
        cancel_url: `http://localhost:5173/rentalInfo/payFail/${rental._id}`,
        // success_url: `${process.env.BASE_URL}${process.env.PORT}/api/v1/rentals/success/${rental._id}`,
        // cancel_url: `${process.env.BASE_URL}${process.env.PORT}/api/v1/rentals/failure/${rental._id}`,
        customer_email: req.user.email,
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: carExist.model,
                        images: carExist?.images?.map(image => image.url)
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: 1,
            },
        ],
    });

    const resData = { id: rental._id, url: session.url };

    await Rental.findByIdAndUpdate(rental._id, { sessionId: session.id }, { new: true });

    sendData(201, "success", "Rental created successfully", resData, res);
});

export const completeRental = catchAsync(async (req, res, next) => {
    const rentalId = req.params.id;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
        throw new AppError("Rental not found", 404);
    }

    rental.status = "completed";
    await rental.save();

    // update the car to available again 
    await Car.findByIdAndDelete(rental.car, { active: true, status: "available" });

    sendData(200, "success", "Rental completed successfully", rental, res);
});

export const paymentSuccess = catchAsync(async (req, res, next) => {

    const rental = await Rental.findById(req.params.id).populate("car");

    if (!rental.sessionId) {
        return next(new AppError("please pay first!", 401));
    }

    if (rental.invoice.id) {
        return next(new AppError("payment invoice already issued!", 401));
    }

    // rental days
    const from = new Date(rental.from);
    const to = new Date(rental.to);
    const differenceInTime = to.getTime() - from.getTime();
    const rentalDaysCount = differenceInTime / (1000 * 3600 * 24);

    // send invoice to the user email
    const invoice = {
        name: req.user.firstName + " " + req.user.lastName,
        address: req.user.address,
        model: rental.car.model,
        rentalDays: rentalDaysCount,
        dailyRate: rental.car.priceForDay,
        paid: rental.finalPrice,
        invoice_nr: rental._id
    };

    const pdfPath = path.join(`./upload/${rental._id}.pdf`);
    // const pdfPath = path.join(__dirname, `./../../../upload/${rental._id}.pdf`);

    createInvoice(invoice, pdfPath);

    // create unique folder name
    const cloudFolder = nanoid();

    // upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath,
        { folder: `${process.env.FOLDER_CLOUD_INVOICES}/rental/${cloudFolder}` });

    // delete the file from the server
    fs.unlink(pdfPath, (err) => {
        if (err) {
            return next(new AppError("Error occurred while deleting the pdf file", 500));
        }
    });

    // send the invoice to the user email
    sendEmail({
        email: req.user.email,
        subject: "Rental Invoice",
        message: "Your rental invoice is attached to this email",
        attachments: [{
            path: secure_url,
            contentType: "application/pdf"
        }]
    });

    // update car status
    await Car.findByIdAndUpdate(rental.car, { status: "rented" }, { new: true });
    await User.findByIdAndUpdate(rental.renterId, { $push: { rentedCars: rental.car } }, { new: true });

    rental.status = "paid";
    rental.invoice.id = public_id;
    rental.invoice.url = secure_url;
    await rental.save();

    sendData(200, "success", "Payment success", rental, res);
});

export const paymentFail = catchAsync(async (req, res, next) => {
    await Rental.findByIdAndDelete(req.params.id);
    sendData(200, "failed", "Payment failed, please try again", undefined, res);
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
                from: "cars",
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
                _id: "$car.category",
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
                from: "cars",
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
                from: "brands",
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

export const totalPlatformRevenue = catchAsync(async (req, res, next) => {
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
    const year = req.params?.year;

    if (!year || isNaN(year)) {
        return res.status(400).json({ status: "error", message: "Invalid year parameter" });
    }

    try {
        const startOfYear = new Date(Number(year), 0, 1);
        const endOfYear = new Date(Number(year), 11, 31, 23, 59, 59);

        // Aggregate to calculate total revenue and platform commission for each month of the year
        const monthlyRevenue = await Rental.aggregate([
            {
                $match: {
                    from: { $gte: startOfYear, $lte: endOfYear } // Filter rentals within the given year
                }
            },
            {
                $project: {
                    month: { $month: { date: "$from", timezone: "UTC" } }, // Extract month from 'from' date in UTC
                    finalPrice: 1 // Include final price
                }
            },
            {
                $group: {
                    _id: { month: "$month" }, // Group by month
                    total: { $sum: "$finalPrice" }, // Sum of final prices for each month
                    revenue: { $sum: { $multiply: ["$finalPrice", 0.20] } } // Sum of platform commission (20%) for each month
                }
            }
        ]);

        // Convert the resulting array to an object with month number as keys
        const monthlyRevenueObj = {};
        monthlyRevenue.forEach(item => {
            monthlyRevenueObj[item._id.month] = {
                total: item.total,
                revenue: item.revenue
            };
        });

        // Prepare response data with month names
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const result = months.map((monthName, index) => ({
            month: index + 1,
            monthName: monthName,
            total: monthlyRevenueObj[index + 1]?.total || 0,
            revenue: monthlyRevenueObj[index + 1]?.revenue || 0
        }));

        res.status(200).json({ status: "success", message: "Monthly revenue fetched successfully", data: result });
    } catch (error) {
        console.error("Error occurred while calculating monthly revenue:", error);
        res.status(500).json({ status: "error", message: "An error occurred while calculating monthly revenue" });
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