import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});

export const rentalValidation = Joi.object({
    renterId: Joi.string()
        .required()
        .custom(isValidObjectId, 'custom validation')
        .messages({
            'any.required': 'RenterId is required',
            'string.base': 'RenterId must be a string',
            'custom.validation': 'Invalid renterId ObjectId'
        }),

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

    finalPrice: Joi.number()
        .required()
        .messages({
            'any.required': 'Rental final price is required',
            'number.base': 'Rental final price must be a number'
        })
});
