import Review from "../../../DB/models/review.model.js";
import catchAsync from "../../utils/catchAsync.js";
import { deleteOne, getAll, getOne, updateOne } from "../controllers.factory.js";
import Car from './../../../DB/models/car.model.js';
import Rental from './../../../DB/models/rental.model.js';

export const addReview = catchAsync(async (req, res, next) => {
  // check car existence
  const carExist = await Car.findById(req.body.carId);
  if (!carExist) {
    return next(new AppError("Car not found", 404));
  }
  // check if the user has rented the car
  const userRentedCar = await Rental.findOne({ renterId: req.user.id, car: req.body.carId });
  if (!userRentedCar) {
    return next(new AppError("You have not rented this car", 404));
  }
  const newReview = await Review.create(req.body);
  sendData(201, "success", "Review added successfully", newReview, res);
});


const populateObj = [
  {
    path: "user",
    select: "-__v -id",
  },
  {
    path: "car",
    select: "-__v -id",
  },
];

export const getAllReviewsOnCar = getAll(Review);

export const getReview = getOne(Review, populateObj);

export const deleteReview = deleteOne(Review);

export const updateReview = updateOne(Review);