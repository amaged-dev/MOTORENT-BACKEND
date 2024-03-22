//
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { sendData } from "../utils/sendData.js";
//-----------------------------------------------
//! 1- get All
export function getAll(Model, PopulateObj) {
  return catchAsync(async (req, res, next) => {
    let filterReviewId = {};

    if (req.params.carId) filterReviewId = { car: req.params.carId };

    const queryFeatured = new APIFeatures(Model.find(filterReviewId).populate(PopulateObj), req.query)
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
    let filter = PopulateObj;
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

    //? if the body have role and the logged in not admin then make it user role in the body
    if (req.body.role && req.user.role === 'user') req.body.role = 'user';

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
