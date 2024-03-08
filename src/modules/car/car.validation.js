import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});


export const addCarValidation = Joi.object({
    ownerId: Joi.string()
        .required()
        .custom(isValidObjectId, 'custom validation')
        .messages({
            'any.required': 'Car owner is required',
            'string.base': 'Owner ID must be a string',
            'custom.validation': 'Invalid owner ObjectId'
        }),

    manufacturingYear: Joi.number()
        .required()
        .messages({
            'any.required': 'Car manufacturing year is required',
            'number.base': 'Manufacturing year must be a number'
        }),

    model: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Car model is required',
            'string.base': 'Model must be a string'
        }),

    brand: Joi.string()
        .required()
        .messages({
            'any.required': 'Car brand is required',
            'string.base': 'Brand ID must be a string'
        }),

    category: Joi.string()
        .valid("SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon")
        .required()
        .default("Sedan")
        .messages({
            'any.required': 'Car category is required',
            'string.base': 'Category must be a string',
            'any.only': 'Invalid car category'
        }),

    tankCapacity: Joi.number()
        .required()
        .messages({
            'any.required': 'Car tank capacity is required',
            'number.base': 'Tank capacity must be a number'
        }),

    average: Joi.number()
        .required()
        .messages({
            'any.required': 'Car average KM is required',
            'number.base': 'Average KM must be a number'
        }),

    transmission: Joi.string()
        .valid("auto", "manual"),

    capacity: Joi.number()
        .required()
        .messages({
            'any.required': 'Car capacity is required',
            'number.base': 'Capacity must be a number'
        }),

    active: Joi.boolean()
        .default(false),

    status: Joi.string()
        .valid("available", "rented", "pending", "rejected")
        .required()
        .default("pending")
        .messages({
            'any.required': 'Car status is required',
            'string.base': 'Status must be a string',
            'any.only': 'Invalid car status'
        }),

    approved: Joi.boolean()
        .default(false),

    priceForDay: Joi.number()
        .required()
        .messages({
            'any.required': 'Car price for day is required',
            'number.base': 'Price for day must be a number'
        }),

    location: Joi.object({
        city: Joi.string()
            .required()
            .messages({
                'any.required': 'City is required',
                'string.base': 'City must be a string'
            }),

        area: Joi.string()
            .required()
            .messages({
                'any.required': 'Area is required',
                'string.base': 'Area must be a string'
            }),

        description: Joi.string()
    }),

    totalKM: Joi.number()
        .default(0),

    plateNumber: Joi.string()
        .required()
        .messages({
            'any.required': 'Please enter car plate number',
            'string.base': 'Plate number must be a string'
        }),

    documents: Joi.object({
        insurance: Joi.string()
            .required()
            .messages({
                'any.required': 'Please enter car insurance',
                'string.base': 'Insurance must be a string'
            }),

        carLicense: Joi.string()
            .required()
            .messages({
                'any.required': 'Please enter car registration',
                'string.base': 'Car license must be a string'
            }),

        carInspection: Joi.string()
            .required()
            .messages({
                'any.required': 'Please enter car inspection',
                'string.base': 'Car inspection must be a string'
            })
    }),

    images: Joi.array()
        .items(Joi.object({
            id: Joi.string().required(),
            url: Joi.string().required()
        })),

    rating: Joi.number()
        .default(1)
        .min(1)
        .max(5)
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5'
        })
});

export const updateCarValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),

    manufacturingYear: Joi.number()
        .required()
        .messages({
            'any.required': 'Car manufacturing year is required',
            'number.base': 'Manufacturing year must be a number'
        }),

    model: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'Car model is required',
            'string.base': 'Model must be a string'
        }),

    brand: Joi.string()
        .required()
        .messages({
            'any.required': 'Car brand is required',
            'string.base': 'Brand ID must be a string'
        }),

    category: Joi.string()
        .valid("SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon")
        .required()
        .default("Sedan")
        .messages({
            'any.required': 'Car category is required',
            'string.base': 'Category must be a string',
            'any.only': 'Invalid car category'
        }),

    tankCapacity: Joi.number()
        .required()
        .messages({
            'any.required': 'Car tank capacity is required',
            'number.base': 'Tank capacity must be a number'
        }),

    average: Joi.number()
        .required()
        .messages({
            'any.required': 'Car average KM is required',
            'number.base': 'Average KM must be a number'
        }),

    active: Joi.boolean(),

    status: Joi.string()
        .valid("available", "rented", "pending", "rejected")
        .messages({
            'string.base': 'Status must be a string',
            'any.only': 'Invalid car status'
        }),

    approved: Joi.boolean(),

    priceForDay: Joi.number()
        .messages({
            'number.base': 'Price for day must be a number'
        }),

    location: Joi.object({
        city: Joi.string(),
        area: Joi.string(),
        description: Joi.string()
    }),

    totalKM: Joi.number(),

    plateNumber: Joi.string(),

    documents: Joi.object({
        insurance: Joi.string(),
        carLicense: Joi.string(),
        carInspection: Joi.string()
    }),

    images: Joi.array()
        .items(Joi.object({
            id: Joi.string().required(),
            url: Joi.string().required()
        })),

    rating: Joi.number()
        .min(1)
        .max(5)
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5'
        })
});