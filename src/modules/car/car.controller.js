import Car from "../../../DB/models/car.model.js";
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from "../controllers.factory.js";

const populateObj = [
  //   {
  //     path: "rentedCars",
  //     select: "-__v -id",
  //   },
  //   {
  //     path: "ownedCars",
  //     select: "-__v -id",
  //   },
];

export const getAllCars = getAll(Car);

export const getCar = getOne(Car, populateObj);

export const deleteCar = deleteOne(Car);

export const updateCar = updateOne(Car);
