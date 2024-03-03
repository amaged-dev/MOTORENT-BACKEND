import express from "express";
const userRouter = express.Router();
import cookieParser from "cookie-parser";
//-----------------------------
// prettier-ignore
import { getAllUsers, getUser, updateUser,deleteUser } from "./user.controller.js";
// prettier-ignore
import { signup, login, logout, verifyAccount} from "./auth.controller.js";
// prettier-ignore
import {forgotPassword, resetPassword, updateMyPassword } from "./password.controller.js"
// prettier-ignore
import { accessRestrictedTo, protect, addUserIdToURL } from "../../middleware/authMiddlewares.js";
//----------------------------
userRouter.use(cookieParser());
//? routes
userRouter.post("/login", login);
userRouter.post("/signup", signup);

userRouter.get("/verify/:token", verifyAccount);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
//----------------------------
//! All following end points need to be loged in to access
userRouter.use(protect);

userRouter.post("/logout", logout);

userRouter
  .route("/userProfile") //? reference to loggedin user
  .get(addUserIdToURL, getUser)
  .patch(addUserIdToURL, updateUser);

userRouter.patch("/userProfile/updatePassword", updateMyPassword);
//------------------------------------------------------------
//! follwing endpoint restricted to only admin
userRouter.use(accessRestrictedTo("admin"));

userRouter.get("/", getAllUsers);

// prettier-ignore
userRouter
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser);
//--------------------------
export default userRouter;
