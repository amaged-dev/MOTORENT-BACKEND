import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idSchema = Joi.object({
    id: Joi.string()
        .custom(isValidObjectId, 'custom validation')
        .required()
        .messages({
            'any.required': 'id is required',
            'string.base': 'id must be a string',
            'custom validation': 'id is not a valid ObjectId'
        }),
});
export const updateBrandSchema = Joi.object({
    id: Joi.string()
        .custom(isValidObjectId, 'custom validation')
        .required()
        .messages({
            'any.required': 'id is required',
            'string.base': 'id must be a string',
            'custom validation': 'id is not a valid ObjectId'
        }),
    brand: Joi.string()
        .required()
        .messages({
            'any.required': 'Brand is required',
            'string.base': 'Brand must be a string'
        })
});
export const addBrandSchema = Joi.object({

    brand: Joi.string()
        .required()
        .messages({
            'any.required': 'Brand is required',
            'string.base': 'Brand must be a string'
        })
});