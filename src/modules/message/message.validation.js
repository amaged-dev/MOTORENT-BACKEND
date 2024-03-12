import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';

export const idValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});

export const createMessageValidation = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            'any.required': 'Message should have a title',
            'string.base': 'Title must be a string'
        }),

    body: Joi.string()
        .required()
        .messages({
            'any.required': 'Message should have a body',
            'string.base': 'Body must be a string'
        }),

    date: Joi.date()
        .default(Date.now()),

    status: Joi.string()
        .valid('solved', 'pending')
        .default('pending')
        .messages({
            'any.only': 'Status must be either "solved" or "pending"',
        }),

    attachments: Joi.object({
        id: Joi.string(),
        url: Joi.string()
    }),

    replay: Joi.string()
});

export const updateMessageValidation = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),

    status: Joi.string()
        .valid('solved', 'pending')
        .default('pending')
        .messages({
            'any.only': 'Status must be either "solved" or "pending"',
        }),
    body: Joi.string()
        .messages({
            'string.base': 'Body must be a string'
        }),

    replay: Joi.string().messages({
        'string.base': 'Title must be a string'
    }),
});