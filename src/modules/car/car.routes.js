import express from "express";
import Car from "../../../DB/models/car.model.js";
import { accessRestrictedTo, isCreatorUserOrAdmin, protect } from "../../middleware/authMiddlewares.js";
import * as carController from "./car.controller.js";

const carRouter = express.Router();

carRouter.get("/", carController.getAllCars);
carRouter.get("/getCarsByManufacturingYear", carController.getCarsByManufacturingYear);
carRouter.get("/getCarsByCategory", carController.getCarsByCategory);
carRouter.get("/getAllCategories", carController.getAllCategories);
carRouter.get("/getTop5Cars", carController.getTop5Cars);
carRouter.get("/getTop5CarsByCategory", carController.getTop5CarsByCategory);
carRouter.get("/getTop5CheapestCars", carController.getTop5CheapestCars);
carRouter.get("/getTop5ExpensiveCars", carController.getTop5ExpensiveCars);
carRouter.get("/getCar", carController.getCar);

carRouter.use(protect);
carRouter.post("/addCar", carController.addCar);

carRouter.use(accessRestrictedTo('admin'));
carRouter.patch("/approveCar/:id", carController.approveCar);
carRouter.patch("/declineCar/:id", carController.declineCar);
carRouter.patch("/suspendCar/:id", carController.suspendCar);
carRouter.patch("/activateCar/:id", carController.activateCar);

carRouter.use(isCreatorUserOrAdmin(Car, "Car"));
carRouter.patch("/updateCar/:id", carController.updateCar);
carRouter.delete("/deleteCar/:id", carController.deleteCar);

export default carRouter;
