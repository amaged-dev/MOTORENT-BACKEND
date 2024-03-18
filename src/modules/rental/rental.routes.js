import express from 'express';
import * as rentalControllers from './rental.controller.js';
import { accessRestrictedTo, isCreatorUserOrAdmin, protect } from './../../middleware/authMiddlewares.js';
import Rental from '../../../DB/models/rental.model.js';

import { isValid } from '../../middleware/validation.js';
import { idValidation, rentalValidation, yearlyRevenueValidation } from './rental.validation.js';
//----------------------------------------
const rentalRouter = express.Router();

rentalRouter.use(protect);

rentalRouter.post("/createRental", isValid(rentalValidation), rentalControllers.createRental);
rentalRouter.get("/success/:id", rentalControllers.paymentSuccess);
rentalRouter.get("/failure/:id", rentalControllers.paymentFail);
rentalRouter.get('/getRecentRentals', rentalControllers.getRecentRentals);
rentalRouter.get('/getRentalsByUserId', rentalControllers.getRentalsByUserId);
rentalRouter.get('/getRentalsByCarId', rentalControllers.getRentalsByCarId);
rentalRouter.get('/getRentalsByDate', rentalControllers.getRentalsByDate);

rentalRouter.get('/getTopCars', rentalControllers.getTopCars);
rentalRouter.get('/getTopCarsByRent', rentalControllers.getTopCarsByRent);
rentalRouter.get('/getTopCategories', accessRestrictedTo('admin'), rentalControllers.getTopCategories);
rentalRouter.get('/getAllRentals', accessRestrictedTo('admin'), rentalControllers.getAllRentals);

rentalRouter.get('/getMyRentals', isCreatorUserOrAdmin(Rental, 'Rental'), rentalControllers.getMyRentals);
rentalRouter.get('/platformRevenue', rentalControllers.totalPlatformRevenue); // total on platform
rentalRouter.get('/revenue/:year', isValid(yearlyRevenueValidation), rentalControllers.calculateMonthlyRevenue);

rentalRouter.route("/:id")
    .get(isValid(idValidation), isCreatorUserOrAdmin(Rental, 'Rental'), rentalControllers.getOneRental)
    .delete(isValid(idValidation), isCreatorUserOrAdmin(Rental, 'Rental'), rentalControllers.deleteOneRental);

export default rentalRouter;