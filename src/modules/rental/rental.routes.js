import express from 'express';
import * as rentalControllers from './rental.controller.js';
import {accessRestrictedTo,isCreatorUserOrAdmin,protect} from './../../middleware/authMiddlewares.js';
import Rental from '../../../DB/models/rental.model.js';
const rentalRouter = express.Router();

rentalRouter.use(protect);

rentalRouter.get('/getRecentRentals', rentalControllers.getRecentRentals);
rentalRouter.get('/getRentalsByUserId', rentalControllers.getRentalsByUserId);
rentalRouter.get('/getRentalsByCarId', rentalControllers.getRentalsByCarId);
rentalRouter.get('/getRentalsByDate', rentalControllers.getRentalsByDate);
rentalRouter.get('/getOneRental', rentalControllers.getOneRental);
rentalRouter.delete('/deleteOneRental', rentalControllers.deleteOneRental);
rentalRouter.post('/createRental', rentalControllers.createRental);

rentalRouter.get('/getMyRentals', isCreatorUserOrAdmin(Rental, 'Rental'), rentalControllers.getMyRentals);
rentalRouter.get('/getAllRentals', accessRestrictedTo('admin'), rentalControllers.getAllRentals);

export default rentalRouter;