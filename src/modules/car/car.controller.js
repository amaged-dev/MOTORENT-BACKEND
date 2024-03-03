import Car from "../../../DB/models/car.model.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "../controllers.factory.js";

export const approveCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Approved Successfully", null, res);
});

export const declineCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: false, status: "rejected" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Declined Successfully", null, res);
});

export const suspendCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { active: false, status: "pending" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Suspended Successfully", null, res);
});

export const activateCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Activated Successfully", null, res);
});

export const getCarsByCategory = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ category: req.body.category });
  if (!cars) {
    return next(new AppError(`This Category Not Exists`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", cars, res);
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Car.find().distinct("category");
  if (!categories) {
    return next(new AppError(`No Categories Exists`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", categories, res);
});

export const getTop5Cars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "car",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalRating: { $sum: "$reviews.rating" },
      },
    },
    {
      $sort: { totalRating: -1 },
    },
    {
      $limit: 5,
    },
  ]);
  sendData(200, "success", "Top 5 Cars fetched successfully", top5Cars, res);
});

const populateObj = [
  {
    path: "rentedCars",
    select: "-__v -id",
  },
  {
    path: "ownedCars",
    select: "-__v -id",
  },
];

export const getAllCars = getAll(Car);

export const getCar = getOne(Car, populateObj);

export const deleteCar = deleteOne(Car);

export const updateCar = updateOne(Car);

export const addCar = createOne(Car);
