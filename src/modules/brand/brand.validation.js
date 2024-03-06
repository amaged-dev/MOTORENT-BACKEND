import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});

export const brandSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    brand: Joi.string().required()
});