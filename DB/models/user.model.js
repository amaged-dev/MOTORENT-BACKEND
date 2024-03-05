import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Must enter your first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Must enter your last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Must enter your email"],
      unique: [true, "email already exists, please enter another email"],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Must Enter Password"],
      trim: true,
      minlength: [8, "password min lenght is 8 characters"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "please enter the password again"],
      select: false,
      validate: {
        validator: function (passwordConfirm) {
          return passwordConfirm === this.password;
        },
        message: "Passwords are not same",
      },
    },
    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: [true, "Must enter your phone number"],
      unique: [
        true,
        "phone number already exists, please enter another phone number",
      ],
      trim: true,
    },
    rentedCars: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Car",
      },
    ],
    ownedCars: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Car",
      },
    ],
    driverLicense: {
      type: String,
      required: [true, "Please enter driver license"],
    },
    passwordChangeDate: {
      type: Date,
      default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    verifyEmailToken: String,
    verifyEmailExpires: Date,

    isLoggedIn: {
      type: Boolean,
      default: false,
      selected: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    wishlist: [{
      type: mongoose.Schema.ObjectId,
      ref: "Car",
    }],
    messages: [{
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//! middelWare to do function pre save the documents

//? 1- to hash the password and save it after check that the password field
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

//? Save the now date to passwordChangeDate Field auto when password changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeDate = new Date() - 2000;
  next();
});

//? only show the active users when using any find function
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

//------------------------verify email method----------------
//? for verify Email
userSchema.methods.createVerifyEmailToken = function (
  expireTimeInMinutes = 15
) {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  this.verifyEmailToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.verifyEmailExpires = Date.now() + expireTimeInMinutes * 60 * 1000;

  return verifyToken;
};

//-----------------------------Password methods-----------------
//? for Reset Password
userSchema.methods.createResetPasswordToken = function (
  expireTimeInMinutes = 15
) {
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + expireTimeInMinutes * 60 * 1000;

  return resetPasswordToken;
};

//? to check if the paswword changed time after the toked created time or not.
userSchema.methods.IsPasswordChangedAfter = function (JWTCreatedTimeStamp) {
  console.log(this.passwordChangeDate, JWTCreatedTimeStamp);
  const passwordChangeTime = this.passwordChangeDate.getTime() / 1000;
  return passwordChangeTime > JWTCreatedTimeStamp;
};

//? static method on user model could access from any instance of user
userSchema.methods.checkCorrectPassword = async (
  inputPassword,
  userPassword
) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
