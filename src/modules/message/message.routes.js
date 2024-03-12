import express from 'express';
import * as messagesController from './message.controller.js';
import { accessRestrictedTo, isCreatorUserOrAdmin, protect } from './../../middleware/authMiddlewares.js';

import { isValid } from '../../middleware/validation.js';
import { idValidation, createMessageValidation, updateMessageValidation } from './message.validation.js';
import { fileUpload, filterObject } from './../../utils/multer.js';
import Message from '../../../DB/models/message.model.js';


const messagesRouter = express.Router();

messagesRouter.use(protect);

messagesRouter.route("/")
    .post(
        fileUpload(filterObject.image).single('attachments'),
        isValid(createMessageValidation), messagesController.sendMessage)
    .get(messagesController.getMyMessages);

messagesRouter.use(accessRestrictedTo('admin'));
messagesRouter.get("/all-messages", messagesController.getAllMessages);
messagesRouter.get("/user-messages/:userId", messagesController.getUserMessages);
messagesRouter.get("/messages-status", messagesController.getMessagesByStatus);

messagesRouter.route("/:id")
    .get(isCreatorUserOrAdmin(Message, 'Message'), isValid(idValidation), messagesController.getMessage)
    .patch(isCreatorUserOrAdmin(Message, 'Message'), isValid(updateMessageValidation), messagesController.addReplay)
    .delete(isCreatorUserOrAdmin(Message, 'Message'), isValid(idValidation), messagesController.deleteMessage);

export default messagesRouter;