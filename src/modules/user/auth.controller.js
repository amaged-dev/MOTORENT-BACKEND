import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../../../DB/models/user.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { sendEmail } from "../../utils/email.js";
import { signupTemp } from "../../utils/generateHTML.js";

//-------------------------------
const signToken = (user, expireWithin = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, {
    // default is 90d written in config.env file
    expiresIn: expireWithin,
  });
};

//-------------------------------
//? creat the token and send it in cookie not in url to be secured and in production will be https
export const createSendToken = (user, statusCode, statusmsg, message, res) => {
  // check if marked login then make the token available within extentended date if not make it expired
  const tokenExpire = user.isLoggedIn ? process.env.JWT_EXPIRES_IN : "0d";
  const token = signToken(user, tokenExpire);
  const cookieExpireWithin = user.isLoggedIn
    ? process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    : -1000;

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireWithin),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // to not show the password in the response

  const logInRes = {
    id: user._id,
    email: user.email,
    userName: user.userName,
    isVerified: user.isVerified,
    isLoggedIn: user.isLoggedIn,
    role: user.role,
  };
  const logOutRes = { id: user._id, email: user.email };

  res.status(statusCode).json({
    status: statusmsg,
    message: message,
    token: user.isLoggedIn ? token : "",
    data: user.isLoggedIn ? logInRes : logOutRes,
  });
};

//-------------------------------------------------
export const signup = catchAsync(async (req, res, next) => {
  const userCheck = await User.findOne({
    email: req.body.email,
  });
  if (userCheck) {
    return next(new AppError("Email Already Exists", 400));
  }

  const newUser = await User.create(req.body);

  //? no need because of the validations before this step
  // const newUser = await User.create({
  //   // ? just pass to the schema model only the required data to save
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   address: req.body.address,
  //   phone: req.body.phone,
  //   role: "user", // allow only user, to be admin need to change it from DB or admin updat it to admin
  // });

  // make token expire within 15 minites
  const token = newUser.createVerifyEmailToken(15);
  await newUser.save({ validateBeforeSave: false });

  // const url = `${process.env.BASE_URL}${process.env.PORT}/api/v1/users/verify/${token}`;
  // const html = signupTemp(url, newUser.firstName);

  const url = `${process.env.BASE_URL}${process.env.PORT}/api/v1/users/verify/${token}`;
  const subject = "Verify Email link will expires whithin 15 minutes";
  const message = `Thank you for signing up! To complete your registration,
    please click on the verification link below.
  `;

  try {
    await sendEmail({
      email: newUser.email,
      subject,
      url,
      message,
      // html,
    });
    res.status(200).json({
      status: "success",
      message: " Verify Email link Sent To your Email",
    });
  } catch (err) {
    console.error(err);
    //? remove the verify token from the user object and save it
    newUser.verifyEmailToken = undefined;
    newUser.verifyEmailExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
//------------------------------------------------
// User Verification
export const verifyAccount = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // get the user by the token and the expire date should greater than now time
  const user = await User.findOne({
    verifyEmailToken: hashedToken,
    verifyEmailExpires: { $gt: new Date() },
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
  //? create Cart

  //? mark the user as verified
  user.isVerified = true;
  user.verifyEmailToken = undefined;
  await user.save();

  sendData(
    200,
    "success",
    "User Email has been Verified Successfully",
    user,
    res
  );
});
//----------------------------------------------------------------
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //? 1- check if user submit both email & password or not
  if (!email || !password) {
    return next(new AppError("Please Provide both email and password", 401));
  }

  //? 2- get the user obj by email an include in it the pass
  const user = await User.findOne({ email }).select("+password +isVerified");
  //?3- check if the user email is not verfied email
  if (!user) {
    return next(new AppError("this email is not a valid email", 401));
  }

  if (!user.isVerified) {
    console.log(user, "login");
    return next(new AppError("Please verify your email", 401));
  }

  //? 3- check if the user email excist & password is correct
  if (!user || !(await user.checkCorrectPassword(password, user.password))) {
    return next(new AppError("Incrorrect email or password", 401));
  }

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    { isLoggedIn: true },
    { new: true }
  );

  //? make token with this user id
  createSendToken(
    loggedInUser,
    200,
    "success",
    "user logged in successfully",
    res
  );
});

//------------------------------------------------
// at the router i will make the protect  middleware before enter this function
export const logout = catchAsync(async (req, res, next) => {
  const loggedInUser = await User.findByIdAndUpdate(
    req.user._id,
    { isLoggedIn: false },
    { new: true }
  );

  //? make this user token expired by marking the user as loggedin= false then will make expire token
  createSendToken(
    loggedInUser,
    200,
    "Success",
    "user logged out successfully",
    res
  );
});
