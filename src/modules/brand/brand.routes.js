import express from 'express';
import * as brandControllers from './brand.controller.js';
import { accessRestrictedTo, protect } from '../../middleware/authMiddlewares.js';
import { isValid } from '../../middleware/validation.js';
import { idSchema, updateBrandSchema, addBrandSchema } from './brand.validation.js';
const brandRouter = express.Router();

brandRouter.get('/', brandControllers.getAllBrands);
brandRouter.get('/:id', isValid(idSchema), brandControllers.getBrand)

brandRouter.use(protect)

brandRouter.use(accessRestrictedTo('admin'))

brandRouter.post('/', isValid(addBrandSchema), brandControllers.addBrand);

brandRouter.route('/:id')
    .patch(isValid(updateBrandSchema), brandControllers.updateBrand)
    .delete(isValid(idSchema), brandControllers.deleteBrand);

export default brandRouter;