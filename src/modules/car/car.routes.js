import express from "express";
const carRouter = express.Router();
//-----------------------------
//? import controllers
import {
  getAllCars,
  getCar,
  updateCar,
  deleteCar,
  addCar,
} from "./car.controller.js";

import {
  accessRestrictedTo,
  protect,
  addUserIdToURL,
} from "../../middleware/authMiddlewares.js";

//----------------------------
//? routes

carRouter.get("/", getAllCars);

carRouter.use(protect);

carRouter.post("/addCar", addCar);
// prettier-ignore
carRouter
.route("/:id")
.get(getCar)
.patch(updateCar)
.delete(deleteCar);
//----------------------------
export default carRouter;
