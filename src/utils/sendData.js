export const sendData = (statusCode, status, message, data, res) => {
    return res.status(statusCode).json({
        status,
        message,
        result: data?.length ? data?.length : undefined,
        data
    });
};