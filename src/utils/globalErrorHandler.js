import AppError from './appError.js';

const handleErrDBCast = (err) => {
    const message = `invalid${err.path} ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFelidDB = (err) => {
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `this ${value} is reserved use another value`;
    return new AppError(message, 400);
};

const handleJwt = (err) => {
    const message = `invalid login, please login again, ${err.name}`;
    return new AppError(message, 401);
};
const handleJwtExpiration = () => {
    const message = `login is expired ,please log again`;
    return new AppError(message, 401);
};

const handleValidationDB = (err) => {
    const error = Object.values(err.errors).map((el) => el.message);
    const message = error.join(' ,');
    return new AppError(message, 400);
};

const sendErrProduction = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        //log the error
        // console.log('error', err.message);
        // send a dummy res to the client
        res.status(500).json({
            status: 'error',
            message: 'something went wrong',
        });
    }
};
const sendErrDevelopment = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

export const errorController = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500; //internal server error
    err.status = err.status || 'fail';

    if (process.env.NODE_ENV == 'development') {
        return sendErrDevelopment(err, res);
    } else if (process.env.NODE_ENV === 'production') {

        if (err.name === 'CastError') err = handleErrDBCast(err); // for requesting wrong id
        if (err.code === 11000) err = handleDuplicateFelidDB(err); // duplicated field
        if (err.name === 'ValidationError') err = handleValidationDB(err); // validation err
        if (err.name === 'JsonWebTokenError') err = handleJwt(err); // token err
        if (err.name === 'TokenExpiredError') err = handleJwtExpiration(); // err expiration time for the token
        sendErrProduction(err, res);
    }
};