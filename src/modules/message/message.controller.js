import Message from '../../../DB/models/message.model.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import { sendData } from '../../utils/sendData.js';
import { deleteOne, getAll } from './../controllers.factory.js';

export const getMyMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.find({ $or: [{ _id: req.user.id }, { driverLicense: req.user.driverLicense }] });
    if (!messages) return next(new AppError("No messages found", 404));
    sendData(200, "success", null, messages, res);
});

export const getUserMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.find({ $or: [{ _id: req.body.id }, { driverLicense: req.body.driverLicense }] });
    if (!messages) return next(new AppError("No messages found", 404));
    sendData(200, "success", null, messages, res);
});

export const getMessagesByStatus = catchAsync(async (req, res, next) => {
    const messages = await Message.find({ status: req.body.status });
    if (!messages) return next(new AppError("No messages found", 404));
    sendData(200, "success", null, messages, res);
});

export const getMessage = catchAsync(async (req, res, next) => {
    const message = await Message.findById(req.params.id);
    if (!message) return next(new AppError("No message found", 404));
    sendData(200, "success", null, message, res);
});

export const addReplay = catchAsync(async (req, res, next) => {
    const message = await Message.findByIdAndUpdate(req.params.id, { replay: req.body.replay, status: "solved" }, { new: true });
    if (!message) return next(new AppError("No message found", 404));
    sendData(200, "success", "Replay added successfully", message, res);
});
//LINK - This function will be edit to add cloudinary image upload
export const sendMessage = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;
    const message = await Message.create(req.body);
    sendData(201, "success", "Message sent successfully", message, res);
});

export const deleteMessage = deleteOne(Message);
export const getAllMessages = getAll(Message);