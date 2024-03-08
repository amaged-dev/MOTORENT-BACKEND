import express from 'express';
import * as brandControllers from './brand.controller.js';
import { accessRestrictedTo } from '../../middleware/authMiddlewares.js';
import { isValid } from '../../middleware/validation.js';
import { idSchema, updateBrandSchema, addBrandSchema } from './brand.validation.js';
const brandRouter = express.Router();

brandRouter.get('/', brandControllers.getAllBrands);
brandRouter.post('/', accessRestrictedTo('admin'), isValid(addBrandSchema), brandControllers.addBrand);

brandRouter.route('/:id')
    .get(isValid(idSchema), brandControllers.getBrand)
    .patch(isValid(updateBrandSchema), accessRestrictedTo('admin'), brandControllers.updateBrand)
    .delete(isValid(idSchema), accessRestrictedTo('admin'), brandControllers.deleteBrand);

export default brandRouter;