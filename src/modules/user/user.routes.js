import express from "express";
const userRouter = express.Router();
import cookieParser from "cookie-parser";
//-----------------------------
// prettier-ignore
import { getAllUsers, getUser, updateUser, deleteUser, clearWishlist, addToWishlist, removeFromWishlist } from "./user.controller.js";
// prettier-ignore
import { signup, login, logout, verifyAccount } from "./auth.controller.js";
// prettier-ignore
import { forgotPassword, resetPassword, updateMyPassword } from "./password.controller.js";
// prettier-ignore
import { accessRestrictedTo, protect, addUserIdToURL } from "../../middleware/authMiddlewares.js";

import { isValid } from '../../middleware/validation.js';

import { idValidation, addUserValidation, resetPasswordValidation, updatePasswordValidation, updateUserValidation, forgotPasswordValidation, loginValidation } from './user.validation.js';
import { fileUpload, filterObject } from "../../utils/multer.js";
//----------------------------
userRouter.use(cookieParser());
//? routes
userRouter.post("/login", isValid(loginValidation), login);
userRouter.post("/signup", fileUpload(filterObject.image).single('image'), isValid(addUserValidation), signup);

userRouter.get("/verify/:token", verifyAccount);
userRouter.post("/forgotPassword", isValid(forgotPasswordValidation), forgotPassword);
userRouter.patch("/resetPassword/:token", isValid(resetPasswordValidation), resetPassword);
//----------------------------
//! All following end points need to be logged in to access

userRouter.use(protect);
userRouter.post("/logout", logout);

userRouter
  .route("/userProfile")
  .get(addUserIdToURL, getUser)
  .patch(addUserIdToURL, isValid(updateUserValidation), updateUser);

userRouter.patch("/userProfile/updatePassword", isValid(updatePasswordValidation), updateMyPassword);

userRouter.delete("/clearWishlist", clearWishlist);
userRouter.route("/wishList")
  .patch(addToWishlist)
  .delete(removeFromWishlist);
//------------------------------------------------------------
//! following endpoint restricted to only admin
userRouter.use(accessRestrictedTo("admin"));

userRouter.get("/", getAllUsers);

// prettier-ignore
userRouter
  .route("/:id")
  .get(isValid(idValidation), getUser)
  .patch(isValid(updateUserValidation), updateUser)
  .delete(isValid(idValidation), deleteUser);
//--------------------------
export default userRouter;
