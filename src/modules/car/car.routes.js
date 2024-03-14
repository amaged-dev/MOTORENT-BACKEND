import express from "express";
import Car from "../../../DB/models/car.model.js";
import { accessRestrictedTo, isCreatorUserOrAdmin, protect } from "../../middleware/authMiddlewares.js";
import * as carController from "./car.controller.js";
import { isValid } from "../../middleware/validation.js";
import { addCarValidation, getCarsByCategoryValidation, getCarsByManufacturingYearValidation, idValidation, updateCarValidation } from "./car.validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { collectDocumentKeysInObject } from "../../middleware/collectKeysInObject.js";

//----------------------------------------------------------
const carRouter = express.Router();

carRouter.get("/", carController.getAllCars);
carRouter.get("/getCarsByManufacturingYear", isValid(getCarsByManufacturingYearValidation), carController.getCarsByManufacturingYear);
carRouter.get("/getCarsByCategory", isValid(getCarsByCategoryValidation), carController.getCarsByCategory);
carRouter.get("/getAllCategories", carController.getAllCategories);
carRouter.get("/getTop5Cars", carController.getTop5Cars);
carRouter.get("/getTop5CarsByCategory", carController.getTop5CarsByCategory);
carRouter.get("/getTop5CheapestCars", carController.getTop5CheapestCars);
carRouter.get("/getTop5ExpensiveCars", carController.getTop5ExpensiveCars);

carRouter.use(protect);
carRouter.post("/addCar", fileUpload(filterObject.image).fields([
    { name: "images", maxCount: 5 },
    { name: 'doc-insurance', maxCount: 1 },
    { name: "doc-carLicense", maxCount: 1 },
    { name: "doc-carInspection", maxCount: 1 },
]), isValid(addCarValidation), collectDocumentKeysInObject, carController.addCar);
carRouter.patch("/updateToAvailable/:id", isCreatorUserOrAdmin(Car, 'Car'), isValid(idValidation), carController.updateToAvailable);

carRouter.use(accessRestrictedTo('admin'));
carRouter.patch("/approveCar/:id", isValid(idValidation), carController.approveCar);
carRouter.patch("/declineCar/:id", isValid(idValidation), carController.declineCar);
carRouter.patch("/suspendCar/:id", isValid(idValidation), carController.suspendCar);
carRouter.patch("/activateCar/:id", isValid(idValidation), carController.activateCar);


carRouter.route("/:id")
    .get(isCreatorUserOrAdmin(Car, "Car"), isValid(idValidation), carController.getCar)
    .delete(isCreatorUserOrAdmin(Car, "Car"), isValid(idValidation), carController.deleteCar)
    .patch(isCreatorUserOrAdmin(Car, "Car"), fileUpload(filterObject.image).fields([
        { name: "images", maxCount: 5 },
        { name: 'doc-insurance', maxCount: 1 },
        { name: "doc-carLicense", maxCount: 1 },
        { name: "doc-carInspection", maxCount: 1 },
    ]), isValid(updateCarValidation), collectDocumentKeysInObject, carController.updateCar);


export default carRouter;
