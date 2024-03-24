import Message from '../../../DB/models/message.model.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import { sendData } from '../../utils/sendData.js';
import { deleteOne, getAll } from './../controllers.factory.js';
import cloudinary from './../../utils/cloud.js';
import { nanoid } from 'nanoid';

export const getMyMessages = catchAsync(async (req, res, next) => {
    // const messages = await Message.find({ $or: [{ _id: req.body.id }, { driverLicense: req.body.driverLicense }] });
    const messages = await Message.find({ user: req.user.id });
    if (!messages) return next(new AppError("No messages found", 404));
    sendData(200, "success", null, messages, res);
});

export const getUserMessages = catchAsync(async (req, res, next) => {
    // const messages = await Message.find({ $or: [{ _id: req.body.id }, { driverLicense: req.body.driverLicense }] });
    const messages = await Message.find({ user: req.params.userId });
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


export const seenUserMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.updateMany({ user: req.user._id }, { seen: true });
console.log(messages)
    if (messages.nModified === 0) {
        return next(new AppError("No messages found for the user", 404));
    }
    sendData(200, "success", "All messages were marked as seen", messages, res);
});
// });
//----------------------------------------
export const sendMessage = catchAsync(async (req, res, next) => {

    req.body.user = req.user.id;

    let attachmentsObj = {};
    if (req.file) {
        // create unique folder name
        const cloudFolder = nanoid();

        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FOLDER_CLOUD_MESSAGES}/documents/${cloudFolder}` });
        attachmentsObj = { id: public_id, url: secure_url };
    }

    const message = await Message.create({
        ...req.body,
        attachments: attachmentsObj
    });
    sendData(201, "success", "Message sent successfully", message, res);
});



export const deleteMessage = deleteOne(Message);
const populateObj = [
    {
        path: "user",
        select: "-__v ",
    }
];

export const getAllMessages = getAll(Message, populateObj);