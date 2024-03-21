import { nanoid } from "nanoid";
import User from "../../../DB/models/user.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import cloudinary from "../../utils/cloud.js";
import { sendData } from "../../utils/sendData.js";
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from "../controllers.factory.js";

export const addToWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id,
    { $addToSet: { wishlist: req.params.carId } },
    { new: true }
  );
  if (!user) {
    return next(new AppError(`user id is not exists`, 404));
  }
  sendData(200, "success", "Car added to wishlist successfully", user, res);
});

export const clearWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id,
    { $set: { wishlist: [] } },
    { new: true }
  );

  if (!user) {
    return next(new AppError(`user id is not exists`, 404));
  }
  sendData(200, "success", "Wishlist cleared successfully", user, res);
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id,
    { $pull: { wishlist: req.params.carId } },
    { new: true }
  );
  if (!user) {
    return next(new AppError(`user id is not exists`, 404));
  }
  sendData(200, "success", "Car removed from wishlist successfully", user, res);
});

export const getAllUserCars = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('ownedCars').select('ownedCars rentedCars');

  if (!user) {
    return next(new AppError(`user id is not exists`, 404));
  }
  sendData(200, "success", "User cars fetched successfully", user, res);
});

const populateObj = [
  {
    path: "rentedCars",
    select: "-__v",
  },
  {
    path: "ownedCars",
    select: "-__v",
  },
  {
    path: "wishlist",
    select: "-__v",
  },
];


export const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const isExist = await User.findById(userId);
  if (!isExist) {
    return next(new AppError(`user id is not exists`, 404));
  }

  // delete user old image from cloudinary
  if (req.file && isExist?.image?.id) {
    await cloudinary.uploader.destroy(isExist.image.id);
  }
  let cloudFolder;

  let userImage = {};
  if (req.file && !isExist?.image?.id) {
    cloudFolder = nanoid();
    req.body.cloudFolder = cloudFolder;

  }

  if (req.file) {
    // create unique folder name
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FOLDER_CLOUD_USERS}/users/${cloudFolder}` });
    userImage = { id: public_id, url: secure_url };
    req.body.image = userImage;
    console.log(req.body.image);

  }

  // update the image only if there is a new image
  const user = await User.findByIdAndUpdate(userId, { ...req.body }, { new: true });

  sendData(200, "success", "User updated successfully", user, res);
});

export const getAllUsers = getAll(User, populateObj);

export const getUser = getOne(User, populateObj);

export const deleteUser = deleteOne(User);

// export const updateUser = updateOne(User);
