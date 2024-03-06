import express from 'express';
import * as brandControllers from './brand.controller.js';
import { accessRestrictedTo } from '../../middleware/authMiddlewares.js';
const brandRouter = express.Router();

brandRouter.get('/', brandControllers.getAllBrands);
brandRouter.post('/', accessRestrictedTo('admin'), brandControllers.addBrand);

brandRouter.route('/:id')
    .get(brandControllers.getBrand)
    .patch(accessRestrictedTo('admin'), brandControllers.updateBrand)
    .delete(accessRestrictedTo('admin'), brandControllers.deleteBrand);

export default brandRouter;