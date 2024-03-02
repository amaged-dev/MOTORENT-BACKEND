//
import APIFeatures from "../utils/apiFeatures";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
//-----------------------------------------------
//! 1- get All
export function getAll(Model) {
  return catchAsync(async (req, res, next) => {
    let filterReviewId = {};

    if (req.params.reviewId) filterReviewId = { Review: req.params.reviewId };

    const queryFeatured = new APIFeatures(Model.find(filterReviewId), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // //? Finaly Excute Query
    const documents = await queryFeatured.queryDB;

    res.status(200).json({
      status: "Success",
      statusMsg: "Fetched Successfully",
      count: documents.length,
      data: documents,
    });
  });
}

// ! 2- get one by id
export function getOne(Model, PopulateObj) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (PopulateObj) query = query.populate(PopulateObj);
    const document = await query;

    if (!document) {
      return next(new AppError(`This Document Id Not Exists`, 404));
    }
    res.status(200).json({
      status: "Success",
      statusMsg: "Fetched Successfully",
      data: document,
    });
  });
}

// ! 3- Update  function by id
export function updateOne(Model) {
  return catchAsync(async (req, res, next) => {
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
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "Success",
      statusMsg: "Created Successfully",
      data: newDocument,
    });
  });
}

// ! 5- Delete one  function by id
export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError(`This Document Id Not Exists`, 404));
    }
    res.status(200).json({
      status: "Success",
      statusMsg: "Deleted Successfully",
    });
  });
}
