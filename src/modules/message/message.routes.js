import express from 'express';
import * as messagesController from './message.controller.js';
import { accessRestrictedTo, protect } from './../../middleware/authMiddlewares.js';

import { isValid } from '../../middleware/validation.js';
import { idValidation, createMessageValidation, updateMessageValidation } from './message.validation.js'



const messagesRouter = express.Router();

messagesRouter.use(protect);

messagesRouter.route("/")
    .post(accessRestrictedTo('user'), isValid(createMessageValidation), messagesController.sendMessage)
    .get(accessRestrictedTo('user'), messagesController.getMyMessages);

messagesRouter.use(accessRestrictedTo('admin'));
messagesRouter.get("/all-messages", messagesController.getAllMessages);
messagesRouter.get("/user-messages", messagesController.getUserMessages);
messagesRouter.get("/messages-status", messagesController.getMessagesByStatus);

messagesRouter.route("/:id")
    .get(isValid(idValidation), messagesController.getMessage)
    .patch(isValid(updateMessageValidation), messagesController.addReplay)
    .delete(isValid(idValidation), messagesController.deleteMessage);

export default messagesRouter;