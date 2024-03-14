import Joi from "joi";
import { isValidObjectId } from './../../middleware/validation.js';


export const idValidation = Joi.object({
    id: Joi.string()
        .custom(isValidObjectId, 'custom validation')
        .required()
        .messages({
            'any.required': 'id is required',
            'string.base': 'id must be a string',
            'custom validation': 'id is not a valid ObjectId'
        }),
});

export const addUserValidation = Joi.object({
    firstName: Joi.string().required().trim().messages({
        'any.required': 'First name is requires',
        'string.empty': 'Must enter your first name',
        'string.trim': 'First name must not contain leading or trailing spaces'
    }),
    lastName: Joi.string().required().trim().messages({
        'any.required': 'Last name is requires',
        'string.empty': 'Must enter your last name',
        'string.trim': 'Last name must not contain leading or trailing spaces'
    }),
    email: Joi.string().email().required().trim().lowercase().messages({
        'any.required': 'Email is requires',
        'string.empty': 'Must enter your email',
        'string.email': 'Email must be a valid email address',
        'string.trim': 'Email must not contain leading or trailing spaces'
    }),
    role: Joi.string().valid('user', 'admin').default('user'),
    password: Joi.string().required().trim().min(8).pattern(
        new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
        )
    ).messages({
        'any.required': 'Password is requires',
        'string.empty': 'Must enter a password',
        'string.min': 'Password must be at least 8 characters long',
        'string.trim': 'Password must not contain leading or trailing spaces',
        "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",

    }),
    passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
        .messages({
            'any.required': 'Please enter the password Confirm',
            'any.only': 'Passwords must match'
        }),
    address: Joi.string().required().messages({
        'any.required': 'Address is requires',
        'string.empty': 'Must enter your address',
    }),
    phone: Joi.string().required().trim().pattern(new RegExp(/^01[0125][0-9]{8}$/))
        .messages({
            'any.required': 'Phone number is requires',
            'string.empty': 'Must enter your phone number',
            'string.trim': 'Phone number must not contain leading or trailing spaces',
            "string.pattern.base":
                "Invalid Phone Number, Must Start With 010/012/011/015 & total 11 digits",

        }),
    rentedCars: Joi.array()
        .items(Joi.string().custom(isValidObjectId))
        .messages({
            'array.base': 'Rented cars must be an array',
            'array.includesRequiredUnknowns': 'Each item in rented cars array must be a valid ObjectId',
            'any.custom': 'Each item in rented cars array must be a valid ObjectId'
        }),

    ownedCars: Joi.array()
        .items(Joi.string().custom(isValidObjectId))
        .messages({
            'array.base': 'Owned cars must be an array',
            'array.includesRequiredUnknowns': 'Each item in owned cars array must be a valid ObjectId',
            'any.custom': 'Each item in owned cars array must be a valid ObjectId'
        }),
    driverLicense: Joi.string().required().messages({
        'any.required': 'Please enter your driver license',
        'string.empty': 'Please enter your driver license'
    }),
    image: Joi.object({
        id: Joi.string(),
        url: Joi.string()
    })
});

export const updateUserValidation = Joi.object({
    id: Joi.string()
        .custom(isValidObjectId, 'custom validation')
        .required()
        .messages({
            'any.required': 'id is required',
            'string.base': 'id must be a string',
            'custom validation': 'id is not a valid ObjectId'
        }),
    firstName: Joi.string().trim().messages({
        'string.empty': 'Must enter your first name',
        'string.trim': 'First name must not contain leading or trailing spaces'
    }),
    lastName: Joi.string().trim().messages({
        'string.empty': 'Must enter your last name',
        'string.trim': 'Last name must not contain leading or trailing spaces'
    }),
    email: Joi.string().email().trim().lowercase().messages({
        'string.empty': 'Must enter your email',
        'string.email': 'Email must be a valid email address',
        'string.trim': 'Email must not contain leading or trailing spaces'
    }),
    role: Joi.string().valid('user', 'admin').default('user'),
    address: Joi.string().messages({
        'string.empty': 'Must enter your address',
    }),
    phone: Joi.string().trim().pattern(new RegExp(/^01[0125][0-9]{8}$/))
        .messages({
            'string.empty': 'Must enter your phone number',
            'string.trim': 'Phone number must not contain leading or trailing spaces',
            "string.pattern.base":
                "Invalid Phone Number, Must Start With 010/012/011/015 & total 11 digits",

        }),
    rentedCars: Joi.array()
        .items(Joi.string().custom(isValidObjectId))
        .messages({
            'array.base': 'Rented cars must be an array',
            'array.includesRequiredUnknowns': 'Each item in rented cars array must be a valid ObjectId',
            'any.custom': 'Each item in rented cars array must be a valid ObjectId'
        }),

    ownedCars: Joi.array()
        .items(Joi.string().custom(isValidObjectId))
        .messages({
            'array.base': 'Owned cars must be an array',
            'array.includesRequiredUnknowns': 'Each item in owned cars array must be a valid ObjectId',
            'any.custom': 'Each item in owned cars array must be a valid ObjectId'
        }),
    driverLicense: Joi.string().messages({
        'string.empty': 'Please enter your driver license'
    })
});


export const resetPasswordValidation = Joi.object({
    password: Joi.string().required().trim().min(8).pattern(
        new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
        )
    ).messages({
        'any.required': 'Password is requires',
        'string.empty': 'Must enter a password',
        'string.min': 'Password must be at least 8 characters long',
        'string.trim': 'Password must not contain leading or trailing spaces',
        "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",

    }),
    passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
        .messages({
            'any.required': 'Please enter the new password confirm',
            'any.only': 'New passwords must match'
        })
});

export const updatePasswordValidation = Joi.object({

    currentPassword: Joi.string().required().trim().messages({
        'any.required': 'Current Password is requires',
        'string.empty': 'Must enter your current password',
        'string.trim': 'Current password must not contain leading or trailing spaces'
    }),
    password: Joi.string().required().trim().min(8).pattern(
        new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
        )
    ).messages({
        'any.required': 'Password is requires',
        'string.empty': 'Must enter a password',
        'string.min': 'Password must be at least 8 characters long',
        'string.trim': 'Password must not contain leading or trailing spaces',
        "string.pattern.base":
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",

    }),
    passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
        .messages({
            'any.required': 'Please enter the new password again',
            'any.only': 'New passwords must match'
        })
});

export const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
        'any.required': 'Email is requires',
        'string.empty': 'Must enter your email',
        'string.email': 'Email must be a valid email address',
    })
});
export const loginValidation = Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
        'any.required': 'Email is requires',
        'string.empty': 'Must enter your email',
        'string.email': 'Email must be a valid email address',
    }),

    password: Joi.string().required().messages({
        'any.required': 'password is requires',
        'string.empty': 'Must enter your password',
    }),
});