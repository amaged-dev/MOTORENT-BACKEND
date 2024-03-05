import express from 'express';
import * as messagesController from './message.controller.js';
import { accessRestrictedTo, protect } from './../../middleware/authMiddlewares.js';
const messagesRouter = express.Router();

messagesRouter.use(protect);

messagesRouter.route("/")
    .post(accessRestrictedTo('user'), messagesController.sendMessage)
    .get(accessRestrictedTo('user'), messagesController.getMyMessages);

messagesRouter.use(accessRestrictedTo('admin'));
messagesRouter.get("/all-messages", messagesController.getAllMessages);
messagesRouter.get("/user-messages", messagesController.getUserMessages);
messagesRouter.get("/messages-status", messagesController.getMessagesByStatus);
messagesRouter.route("/:id")
    .get(messagesController.getMessage)
    .patch(messagesController.addReplay)
    .delete(messagesController.deleteMessage);

export default messagesRouter;