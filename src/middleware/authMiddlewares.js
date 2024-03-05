import { promisify } from "util";
import jwt from "jsonwebtoken";

import User from "../../DB/models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
//----------------------------------------------------

//? add my object to the req.params as middleware to reuse
export const addUserIdToURL = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//? MiddleWare to check if the user role is included in the specified roles have access
export const accessRestrictedTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "your account is not allowed to perform this action, call the admin for permission",
          403
        )
      );
    }
    next();
  };
};

//? this middleware function is to protect the page from entered by not logged in user or has expired token
export const protect = catchAsync(async (req, res, next) => {
  //? 1- get the toke from req.header after check if its sent
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "You Are Not Logged in, please login first and try again",
        401
      )
    );
  }

  //? 2-verify token ( decode the token and check if it is same id)

  console.log("token*****", token);
  const decodeToken = await promisify(jwt.verify)(token, process.env.JWT_KEY);

  //? 3- check if user still exists
  const loggedInUser = await User.findById(decodeToken.id);
  if (!loggedInUser) {
    return next(
      new AppError(
        "This token user is no longer exist, please try another login",
        401
      )
    );
  }

  //? 4- check if user changed password after token was issued
  if (loggedInUser.IsPasswordChangedAfter(decodeToken.iat)) {
    return next(
      new AppError(
        "this user password was changed after token was issued, please login again.",
        401
      )
    );
  }

  req.user = loggedInUser;
  next();
});

//--------------------------------------------------------
export const isVerified = catchAsync(async (req, res, next) => {
  if (req.user.isVerified) {
    next();
  } else {
    return next(
      new AppError(
        "Your account is not verified, please verify your account first",
        403
      )
    );
  }
});

//-----------------------------------------------------
//? middleware to only allow the creator or admin to perform the next action
export const isCreatorUserOrAdmin = (Model, modelName) => {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document)
      return next(new AppError(res, `This ${modelName} is not found`, 401));
    if (
      req.user.role !== "admin" &&
      String(document.createdBy) !== String(req.user._id)
    ) {
      return next(
        new AppError(
          res,
          `Only Admin or createrUser can perform this to ${modelName}`,
          401
        )
      );
    }
    next();
  });
};
