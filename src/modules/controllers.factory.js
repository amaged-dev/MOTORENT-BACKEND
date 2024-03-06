//
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { sendData } from "../utils/sendData.js";
//-----------------------------------------------
//! 1- get All
export function getAll(Model) {
  return catchAsync(async (req, res, next) => {
    let filterCarId = {};

    if (req.params.carId) filterCarId = { car: req.params.carId };

    const queryFeatured = new APIFeatures(Model.find(filterReviewId), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // //? Finaly Excute Query
    const documents = await queryFeatured.queryDB;

    sendData(
      200,
      "success",
      "Requested data successfully fetched",
      documents,
      res
    );
  });
}

// ! 2- get one by id
export function getOne(Model, PopulateObj) {
  return catchAsync(async (req, res, next) => {
    let filter = PopulateObj || {};
    let query = Model.findById(req.params.id);
    if (filter) query = query.populate(filter);
    const document = await query;

    if (!document) {
      return next(new AppError(`This Document Id Not Exists`, 404));
    }
    sendData(
      200,
      "success",
      "Requested data successfully fetched",
      document,
      res
    );
  });
}

// ! 3- Update  function by id
export function updateOne(Model) {
  return catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError("this route is not for password update", 500));
    }
    //? No need for select from the body because of the validation middleware
    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedDocument) {
      return next(new AppError(`This Document Id Not Exists`, 404));
    }
    res.status(200).json({
      status: "Success",
      data: updatedDocument,
    });
  });
}

// ! 4- create new one  by id
export function createOne(Model) {
  return catchAsync(async (req, res, next) => {
    //? depend on the previous validations
    const newDocument = await Model.create(req.body);

    sendData(200, "success", "Created successfully", newDocument, res);
  });
}

// ! 5- Delete one  function by id
export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError(`This Document Id Not Exists`, 404));
    }

    sendData(200, "success", "Deleted Successfully", document, res);
  });
}
