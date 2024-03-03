import Review from "../../../DB/models/review.model.js";
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
} from "../controllers.factory.js";

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

export const updateCar = updateOne(Review);

export const addReview = createOne(Review);
