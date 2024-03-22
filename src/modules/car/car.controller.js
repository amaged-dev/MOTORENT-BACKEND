import { nanoid } from "nanoid";
import Car from "../../../DB/models/car.model.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { getAll, getOne } from "../controllers.factory.js";
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
export const getCarsByCategories = catchAsync(async (req, res, next) => {
  const categories = req.body.categories.map(category => category.toUpperCase());

  const cars = await Car.find({ category: { $in: categories } });

  if (!cars || cars.length === 0) {
    return next(new AppError(`No Cars Found with the Specified Categories`, 404));
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
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brandArray",
      },
    },
    {
      $addFields: {
        brand: { $arrayElemAt: ["$brandArray", 0] },
      },
    },
    {
      $project: {
        brandArray: 0, 
      },
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
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
  ]);
  sendData(200, "success", "Top 5 Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getTop5CheapestCars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.find().sort({ priceForDay: 1 }).limit(5).populate('brand');
  sendData(200, "success", "Top 5 Cheapest Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getTop5ExpensiveCars = catchAsync(async (req, res, next) => {
  const top5Cars = await Car.find().sort({ priceForDay: -1 }).limit(5).populate('brand');
  sendData(200, "success", "Top 5 Expensive Cars fetched successfully", top5Cars, res);
});

//----------------------------------------------
export const getCarsByManufacturingYear = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ manufacturingYear: { $gte: req.body.from, $lte: req.body.to } }).populate('brand');
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
        { folder: `${process.env.FOLDER_CLOUD_CARS}/images/${cloudFolder}` });
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

  const idsArray = [];

  for (const key in isExist.documents) {
    if (isExist.documents.hasOwnProperty(key)) {
      const document = isExist.documents[key];
      idsArray.push(document.id);
    }
  }

  // delete the old documents from cloudinary
  const result2 = await cloudinary.api.delete_resources(idsArray);
  // delete documents folder
  await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/documents/${isExist.cloudFolder}`);

  // delete the old images from cloudinary
  const result = await cloudinary.api.delete_resources(ids);
  // delete image folder
  await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/images/${isExist.cloudFolder}`);

  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) {
    return next(new AppError(`car id is not exists`, 404));
  }
  sendData(200, "success", "Car deleted successfully", null, res);
});

export const deleteAllCars = catchAsync(async (req, res, next) => {
  const cars = await Car.find();
  if (!cars) return next(new AppError(`No cars exists`, 404));

  for (const car of cars) {
    const imagesArray = car.images;
    const ids = imagesArray.map((imageObject) => imageObject.id);

    const idsArray = [];

    for (const key in car.documents) {
      if (car.documents.hasOwnProperty(key)) {
        const document = car.documents[key];
        idsArray.push(document.id);
      }
    }

    // delete the old documents from cloudinary
    const result2 = await cloudinary.api.delete_resources(idsArray);
    // delete documents folder
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/documents/${car.cloudFolder}`);

    // delete the old images from cloudinary
    const result = await cloudinary.api.delete_resources(ids);
    // delete image folder
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_CARS}/images/${car.cloudFolder}`);
  }

  await Car.deleteMany();
  sendData(200, "success", "All cars deleted successfully", null, res);
})



//----------------------------------------------
const populateObj = [
  {
    path: "brand",
    select: "-__v -_id",
  }
];

export const getAllCars = getAll(Car, populateObj);

export const getCar = getOne(Car, populateObj);

// get all getAllAvailableCars
export const getAllAvailableCars = catchAsync(async (req, res, next) => {
  const availableCars = await Car.find({ status: 'available' }).populate(populateObj);
  sendData(
    200,
    "success",
    "Requested Cars successfully fetched",
    availableCars,
    res
  );
});
