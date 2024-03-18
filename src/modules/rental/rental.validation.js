import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});

export const rentalValidation = Joi.object({
    car: Joi.string()
        .required()
        .custom(isValidObjectId, 'custom validation')
        .messages({
            'any.required': 'Car ID is required',
            'string.base': 'Car ID must be a string',
            'custom.validation': 'Invalid car ObjectId'
        }),

    from: Joi.date()
        .required()
        .messages({
            'any.required': 'Rental from date is required',
            'date.base': 'Rental from date must be a valid date'
        }),

    to: Joi.date()
        .required()
        .messages({
            'any.required': 'Rental to date is required',
            'date.base': 'Rental to date must be a valid date'
        }),
});

export const yearlyRevenueValidation = Joi.object({
    year: Joi.number()
        .required()
        .min(2023)
        .messages({
            'any.required': 'Year is required',
            'number.base': 'Year must be a number',
            'number.min': 'Year must be greater than 2020',
            'number.max': 'Year must be less than 2030'
        })
});