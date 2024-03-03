import APIFeatures from "../../utils/apiFeatures.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import User from "../../../DB/models/user.model.js";
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from "../controllers.factory.js";

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

export const getAllUsers = getAll(User);

export const getUser = getOne(User, populateObj);

export const deleteUser = deleteOne(User);

export const updateUser = updateOne(User);
