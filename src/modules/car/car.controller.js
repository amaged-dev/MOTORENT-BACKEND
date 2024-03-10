import { nanoid } from "nanoid";
import Car from "../../../DB/models/car.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "../controllers.factory.js";
import cloudinary from './../../utils/cloud.js';

import dotenv from "dotenv";
dotenv.config();

export const addCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findOne({ plateNumber: req.body.plateNumber });
  if (isExist) return next(new AppError(`Car already exists`, 404));

  if (!req.files) return next(new AppError("Product Images are required!", 400));

  // create unique folder name
  const cloudFolder = nanoid();

  let images = [];
  // upload images 
  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
      { folder: `${process.env.FOLDER_CLOUD_CARS}/images/${cloudFolder}` });
    images.push({ id: public_id, url: secure_url });
  }


  // console.log(req.files, "req.files.documents")

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
  // console.log(documents, "documents")
  const newCar = await Car.create({
    ...req.body,
    cloudFolder,
    images,
    documents,
  });
  sendData(201, "success", "Car added successfully", newCar, res);
});


export const approveCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Approved Successfully", null, res);
});

export const declineCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: false, status: "rejected" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Declined Successfully", null, res);
});

export const suspendCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { active: false, status: "pending" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Suspended Successfully", null, res);
});

export const activateCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));
  // update car approval status
  const car = await Car.findByIdAndUpdate(req.params.id, { approved: true, active: true, status: "available" });
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car Activated Successfully", null, res);
});

export const getCarsByCategory = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ category: req.body.category });
  if (!cars) {
    return next(new AppError(`This Category Not Exists`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", cars, res);
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Car.find().distinct("category");
  if (!categories) {
    return next(new AppError(`No Categories Exists`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", categories, res);
});

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

export const getTop5CheapestCars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.find().sort({ priceForDay: 1 }).limit(5);
  sendData(200, "success", "Top 5 Cheapest Cars fetched successfully", top5Cars, res);
});

export const getTop5ExpensiveCars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.find().sort({ priceForDay: -1 }).limit(5);
  sendData(200, "success", "Top 5 Expensive Cars fetched successfully", top5Cars, res);
});

export const getCarsByManufacturingYear = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ manufacturingYear: { $gte: req.body.from, $lte: req.body.to } });
  if (!cars) {
    return next(new AppError(`No Cars Exists in this year`, 404));
  }
  sendData(200, "success", "Requested data successfully fetched", cars, res);
});

export const updateCar = catchAsync(async (req, res, next) => {
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));

  if (!req.files) return next(new AppError("car Images are required!", 400));

  const imagesArray = isExist.images;

  const ids = imagesArray.map((imageObject) => imageObject.id);

  // delete the old images from cloudinary
  const result = await cloudinary.api.delete_resources(ids);
  // delete image folder
  await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/images/${isExist.cloudFolder}`);

  // create unique folder name
  const cloudFolder = nanoid();

  let images = [];
  // upload images 
  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
      { folder: `${process.env.FOLDER_CLOUD_CARS}/cars/${cloudFolder}` });
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
  // console.log(documents, "documents")
  const updatedCar = await Car.findByIdAndUpdate(req.params.id, {
    ...req.body,
    images,
    documents,
  });
  if (!updatedCar) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car updated successfully", updatedCar, res);
});

export const deleteCar = catchAsync(async (req, res, next) => {
  console.log("ksom isreal");
  // check car existence
  const isExist = await Car.findById(req.params.id);
  if (!isExist) return next(new AppError(`car id is not exists`, 404));

  const imagesArray = isExist.images;

  const ids = imagesArray.map((imageObject) => imageObject.id);
  console.log(process.env.FOLDER_CLOUD_CARS, "process.env.FOLDER_CLOUD_NAME");
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

const populateObj = [
  {
    path: "rentedCars",
    select: "-__v -id",
  },
  {
    path: "ownedCars",
    select: "-__v -id",
  },
];

export const getAllCars = getAll(Car);

export const getCar = getOne(Car, populateObj);

// export const deleteCar = deleteOne(Car);

// export const updateCar = updateOne(Car);

// export const addCar = createOne(Car);
