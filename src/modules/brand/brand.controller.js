import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { createOne, deleteOne, updateOne, getAll } from "../controllers.factory.js";
import Brand from './../../../DB/models/brand.model.js';


export const getBrand = catchAsync(async (req, res, next) => {
    const brand = await Brand.findOne({ $or: { _id: req.params.id, brand: req.body.brand } });
    if (!brand) {
        return next(new AppError("This Brand Id Not Exists", 404));
    }

    sendData(200, "success", "Requested data successfully fetched", brand, res);
});

export const addBrand = createOne(Brand);
export const deleteBrand = deleteOne(Brand);
export const updateBrand = updateOne(Brand);
export const getAllBrands = getAll(Brand);