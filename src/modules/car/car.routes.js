import express from "express";
import Car from "../../../DB/models/car.model.js";
import { accessRestrictedTo, isCreatorUserOrAdmin, protect } from "../../middleware/authMiddlewares.js";
import * as carController from "./car.controller.js";
import { isValid } from "../../middleware/validation.js";
import { addCarValidation, idValidation, updateCarValidation } from "./car.validation.js";

//----------------------------------------------------------
const carRouter = express.Router();

carRouter.get("/", carController.getAllCars);
carRouter.get("/getCarsByManufacturingYear", carController.getCarsByManufacturingYear);
carRouter.get("/getCarsByCategory", carController.getCarsByCategory);
carRouter.get("/getAllCategories", carController.getAllCategories);
carRouter.get("/getTop5Cars", carController.getTop5Cars);
carRouter.get("/getTop5CarsByCategory", carController.getTop5CarsByCategory);
carRouter.get("/getTop5CheapestCars", carController.getTop5CheapestCars);
carRouter.get("/getTop5ExpensiveCars", carController.getTop5ExpensiveCars);

carRouter.use(protect);
carRouter.post("/addCar", isValid(addCarValidation), carController.addCar);

carRouter.use(accessRestrictedTo('admin'));
carRouter.patch("/approveCar/:id", isValid(idValidation), carController.approveCar);
carRouter.patch("/declineCar/:id", isValid(idValidation), carController.declineCar);
carRouter.patch("/suspendCar/:id", isValid(idValidation), carController.suspendCar);
carRouter.patch("/activateCar/:id", isValid(idValidation), carController.activateCar);

carRouter.use(isCreatorUserOrAdmin(Car, "Car"));

carRouter.route("/:id")
    .get(isValid(idValidation), carController.getCar)
    .patch(isValid(updateCarValidation), carController.updateCar)
    .delete(isValid(idValidation), carController.deleteCar)

export default carRouter;
