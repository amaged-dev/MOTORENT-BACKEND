import { Types } from 'mongoose';
import AppError from '../utils/appError.js';

export const isValidObjectId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) {
        return true;
    } else {
        return helper.message('Invalid objectId');
    }
};

export const isValid = (schema) => {
    return (req, res, next) => {
        console.log(req.params);
        const reqCopy = { ...req.body, ...req.params, ...req.query };
        const validationResult = schema.validate(reqCopy, { abortEarly: false });

        if (validationResult.error) {
            const messages = validationResult.error.details.map((error) => error.message);
            return next(new AppError(messages, 404));
        }
        return next();
    };
};