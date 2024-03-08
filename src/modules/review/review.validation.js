import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';


export const idValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});

export const addReviewValidation = Joi.object({
    review: Joi.string()
        .required()
        .messages({
            'any.required': 'A review must have content',
            'string.base': 'A review must be a string'
        }),

    rating: Joi.number()
        .required()
        .min(1)
        .max(5)
        .messages({
            'any.required': 'A review must have a rating',
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must start from 1.0',
            'number.max': 'Rating must be below or equal  5.0'
        }),

    user: Joi.string()
        .custom(isValidObjectId, 'custom validation')
        .required()
        .messages({
            'any.required': 'Review must belong to a user',
            'string.base': 'User must be a string',
            'custom.validation': 'Invalid user ObjectId'
        }),

    car: Joi.string()
        .custom(isValidObjectId, 'custom validation')
        .required()
        .messages({
            'any.required': 'Review must belong to a car',
            'string.base': 'Car must be a string',
            'custom.validation': 'Invalid car ObjectId'
        })
});

export const updateReviewValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),

    review: Joi.string()
        .messages({
            'string.base': 'A review must be a string'
        }),

    rating: Joi.number()
        .min(1)
        .max(5)
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must start from 1.0',
            'number.max': 'Rating must be below or equal  5.0'
        }),
});