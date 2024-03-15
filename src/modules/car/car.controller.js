import { nanoid } from "nanoid";
import Car from "../../../DB/models/car.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "../controllers.factory.js";
import cloudinary from './../../utils/cloud.js';

import dotenv from "dotenv";
import User from "../../../DB/models/user.model.js";
dotenv.config();

//----------------------------------------------
// approve that rental has received the car

export const updateToAvailable = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car is not exists`, 404));
  if (isExist.active !== true) return next(new AppError(`car is not active yet, please contact with us!`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" }, { new: true });

  sendData(200, "success", "Car Activated Successfully", car, res);
});

//----------------------------------------------
export const addCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findOne({ plateNumber: req.body.plateNumber });
  if (isExist) return next(new AppError(`Car already exists`, 404));


  if (!req.files.images) return next(new AppError("Car Images are required!", 400));
  if (req.files.documents.length < 3) return next(new AppError("Car documents are required!", 400));

  // create unique folder name
  const cloudFolder = nanoid();

  let images = [];
  // upload images 
  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
      { folder: `${process.env.FOLDER_CLOUD_CARS}/images/${cloudFolder}` });
    images.push({ id: public_id, url: secure_url });
  }


  let documents = {};
  for (const documentObj of req.files.documents) {
    for (const key in documentObj) {
      const files = documentObj[key];
      for (const file of files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.FOLDER_CLOUD_CARS}/documents/${cloudFolder}` });
        documentObj[key] = { id: public_id, url: secure_url };
      }
      documents = { ...documents, ...documentObj };
    }
  }

  const newCar = await Car.create({
    ...req.body,
    ownerId: req.user._id,
    cloudFolder,
    images,
    documents,
  });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { ownedCars: newCar._id } }, { new: true });
  sendData(201, "success", "Car added successfully", newCar, res);
});

//----------------------------------------------
export const approveCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Approved Successfully", car, res);
});

//----------------------------------------------
export const declineCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: false, status: "rejected" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Declined Successfully", car, res);
});

//----------------------------------------------
export const suspendCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { active: false, status: "pending" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Suspended Successfully", car, res);
});

//----------------------------------------------
export const activateCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Activated Successfully", car, res);
});

//----------------------------------------------
export const getCarsByCategory = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ category: req.body.category.toUpperCase() });
  if (!cars) {
    return next(new AppError(`This Category Not Exists`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", cars, res);
});

//----------------------------------------------
export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Car.find().distinct("category");
  if (!categories) {
    return next(new AppError(`No Categories Exists`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", categories, res);
});

//----------------------------------------------
export const getTop5Cars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "car",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalRating: { $sum: "$reviews.rating" },
      },
    },
    {
      $sort: { totalRating: -1 },
    },
    {
      $limit: 5,
    },
  ]);
  sendData(200, "success", "Top 5 Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getTop5CarsByCategory = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.aggregate([
    {
      $match: { category: req.body.category },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "car",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalRating: { $sum: "$reviews.rating" },
      },
    },
    {
      $sort: { totalRating: -1 },
    },
    {
      $limit: 5,
    },
  ]);
  sendData(200, "success", "Top 5 Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getTop5CheapestCars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.find().sort({ priceForDay: 1 }).limit(5);
  sendData(200, "success", "Top 5 Cheapest Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getTop5ExpensiveCars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.find().sort({ priceForDay: -1 }).limit(5);
  sendData(200, "success", "Top 5 Expensive Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getCarsByManufacturingYear = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ manufacturingYear: { $gte: req.body.from, $lte: req.body.to } });
  if (!cars) {
    return next(new AppError(`No Cars Exists in this year`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", cars, res);
});

//----------------------------------------------
export const updateCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));

  let images;
  let documents;
  let cloudFolder;
  if (req.files.images) {

    const imagesArray = isExist.images;

    const ids = imagesArray.map((imageObject) => imageObject.id);

    // delete the old images from cloudinary
    const result = await cloudinary.api.delete_resources(ids);
    // delete image folder
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/images/${isExist.cloudFolder}`);

    cloudFolder = nanoid();

    images = [];
    // upload images 
    for (const file of req.files.images) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
        { folder: `${process.env.FOLDER_CLOUD_CARS}/cars/${cloudFolder}` });
      images.push({ id: public_id, url: secure_url });
    }
  }

  if (req.files.documents.length !== 0) {
    documents = {};
    cloudFolder ? cloudFolder : cloudFolder = nanoid();

    for (const documentObj of req.files.documents) {
      for (const key in documentObj) {
        const files = documentObj[key];
        for (const file of files) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.FOLDER_CLOUD_CARS}/documents/${cloudFolder}` });
          documentObj[key] = { id: public_id, url: secure_url };
        }
        documents = { ...documents, ...documentObj };
      }
    }
    // console.log(documents, "documents")

  }

  const updateObject = {
    ...req.body
  };


  if (images) {
    updateObject.images = images;
    updateObject.cloudFolder = cloudFolder;
  }

  if (documents) {
    updateObject.documents = documents;
    updateObject.cloudFolder = cloudFolder;
  }

  const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateObject, {
    new: true,
  });
  if (!updatedCar) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car updated successfully", updatedCar, res);
});

//----------------------------------------------
export const deleteCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));

  const imagesArray = isExist.images;

  const ids = imagesArray.map((imageObject) => imageObject.id);

  // delete the old images from cloudinary
  const result = await cloudinary.api.delete_resources(ids);
  // delete image folder
  await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/cars/${isExist.cloudFolder}`);

  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car deleted successfully", null, res);
});

//----------------------------------------------
const populateObj = [
  {
    path: "brand",
    select: "-__v -_id",
  }
];

export const getAllCars = getAll(Car, populateObj);

export const getCar = getOne(Car, populateObj);