import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});


export const addCarValidation = Joi.object({
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
        .valid("SUV", "SEDAN", "HATCHBACK", "COUPE", "CONVERTIBLE", "WAGON")
        .default("SEDAN")
        .required()
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

    transmission: Joi.string().required()
        .valid("auto", "manual").messages({
            'any.required': 'Car transmission is required',
            'string.base': 'transmission name must be a string',
            'any.only': 'Invalid car transmission'
        }),

    capacity: Joi.number()
        .required()
        .messages({
            'any.required': 'Car capacity is required',
            'number.base': 'Capacity must be a number'
        }),

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
});

export const updateCarValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),

    manufacturingYear: Joi.number()
        .messages({
            'number.base': 'Manufacturing year must be a number'
        }),

    model: Joi.string()
        .trim()
        .messages({
            'string.base': 'Model must be a string'
        }),

    brand: Joi.string()
        .messages({
            'string.base': 'Brand ID must be a string'
        }),

    category: Joi.string()
        .valid("SUV", "SEDAN", "HATCHBACK", "COUPE", "CONVERTIBLE", "WAGON")
        .default("SEDAN")
        .messages({
            'string.base': 'Category must be a string',
            'any.only': 'Invalid car category'
        }),

    tankCapacity: Joi.number()
        .messages({
            'number.base': 'Tank capacity must be a number'
        }),
    transmission: Joi.string().valid("auto", "manual").messages({
        'any.required': 'Car transmission is required',
        'string.base': 'transmission name must be a string',
        'any.only': 'Invalid car transmission'
    }),

    capacity: Joi.number().messages({
        'any.required': 'Car capacity is required',
        'number.base': 'Capacity must be a number'
    }),

    average: Joi.number()
        .messages({
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
            id: Joi.string(),
            url: Joi.string()
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

export const getCarsByManufacturingYearValidation = Joi.object({
    from: Joi.number()
        .required()
        .messages({
            'any.required': 'manufacturingYear from date is required',
            'date.base': 'manufacturingYear from date must be a valid date'
        }),

    to: Joi.number()
        .required()
        .messages({
            'any.required': 'manufacturingYear to date is required',
            'date.base': 'manufacturingYear to date must be a valid date'
        }),
});

export const getCarsByCategoryValidation = Joi.object({
    category: Joi.string()
        .valid("SUV", "SEDAN", "HATCHBACK", "COUPE", "CONVERTIBLE", "WAGON")
        .required()
        .messages({
            'any.required': 'Car category is required',
            'string.base': 'Category must be a string',
            'any.only': 'Invalid car category'
        }),
});
export const getCarsByCategoriesValidation = Joi.object({
    categories: Joi.array().items(Joi.string()
        .valid("SUV", "SEDAN", "HATCHBACK", "COUPE", "CONVERTIBLE", "WAGON"))
        .required()
        .messages({
            'any.required': 'Car category is required',
            'string.base': 'Category must be a string',
            'any.only': 'Invalid car category'
        }),
});