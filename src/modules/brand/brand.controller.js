import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { createOne, deleteOne, updateOne, getAll, getOne } from "../controllers.factory.js";
import Brand from './../../../DB/models/brand.model.js';


export const addBrand = createOne(Brand);
export const deleteBrand = deleteOne(Brand);
export const getBrand = getOne(Brand);
export const updateBrand = updateOne(Brand);
export const getAllBrands = getAll(Brand);