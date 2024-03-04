import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../../../DB/models/user.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { sendEmail } from "../../utils/email.js";
import { resetPassTemp } from "../../utils/generateHTML.js";
import { createSendToken } from "./auth.controller.js";

//----------------------------------------------------------------
export const updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // 2- check if the entered current password match the user password
  if (
    !(await user.checkCorrectPassword(req.body.currentPassword, user.password))
  ) {
    return next(
      new AppError("The user Password is not correct, please try again", 400)
    );
  }
  const { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    return next(
      new AppError(res, "Passwords do not match, please try again", 400)
    );
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  createSendToken(user, 200, "Success", "password Updated successfully", res);
});

//----------------------------------------------
//! forgor password functionality
export const forgotPassword = catchAsync(async (req, res, next) => {
  //? 1- get the user by sent email
  const user = await User.findOne({ email: req.body.email });

  //? 2- generate a random token will expires in 15 minutes
  const resetToken = user.createResetPasswordToken(15);
  await user.save({ validateBeforeSave: false });

  //? 3- send email to the user with the reset pass token
  // const url = `${process.env.BASE_URL}api/v1/users/resetPassword/${token}`;
  // const resetPasswordHTML = resetPassTemp(url, newUser.firstName);

  const url = `${process.env.BASE_URL}${process.env.PORT}/api/v1/users/resetPassword/${resetToken}`;
  const subject = "Reset Password Token link will expires whithin 15 minutes";
  const message = `We've received a request to reset your password,
   Copy this code to your page: ${resetToken}.
   If you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject,
      url,
      message,
      // html: resetPasswordHTML,
    });
    res.status(200).json({
      status: "success",
      message: " Reset Password link Sent To your Email",
    });
  } catch (err) {
    //? remove the reset token from the user object and save it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

//----------------------------------------------------------------

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });
  //2- if toke not expired and user is exsists
  if (!user) {
    return next(
      new AppError(
        "This token is invalid or has expired, please try again",
        400
      )
    );
  }

  //?- set the password field = the new pass from the body
  // reset the resettoken and expire date to undefined
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  //? 5- login the user in , send JWT to him
  createSendToken(
    user,
    200,
    "Success",
    "User Password Updated Successfully",
    res
  );
});
