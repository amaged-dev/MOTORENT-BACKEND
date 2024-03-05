import express from "express";
const carRouter = express.Router();
//-----------------------------
//? import controllers
import {
  getAllReviewsOnCar,
  getReview,
  updateReview,
  deleteReview,
  addReview,
} from "./review.controller.js";

import {
  protect,
  isCreatorUserOrAdmin,
} from "../../middleware/authMiddlewares.js";

//----------------------------
//? routes

carRouter.get("/getAllReviewsOnCar", getAllReviewsOnCar);

carRouter.use(protect);

carRouter.post("/addCar", addReview);

carRouter.use(isCreatorUserOrAdmin);
// prettier-ignore
carRouter
  .route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);
//----------------------------
export default carRouter;
