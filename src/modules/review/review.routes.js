import express from "express";
import { isCreatorUserOrAdmin, protect } from "../../middleware/authMiddlewares.js";
import { addReview, deleteReview, getAllReviewsOnCar, getReview, updateReview } from "./review.controller.js";
import Review from "../../../DB/models/review.model.js";
import { isValid } from '../../middleware/validation.js';
import { idValidation, addReviewValidation, updateReviewValidation } from "./review.validation.js"

const reviewRouter = express.Router();

reviewRouter.get("/getAllReviewsOnCar", getAllReviewsOnCar);

reviewRouter.use(protect);

reviewRouter.post("/addReview", isValid(addReviewValidation), addReview);

reviewRouter.use(isCreatorUserOrAdmin(Review, 'Review'));
// prettier-ignore
reviewRouter
  .route("/:id")
  .get(isValid(idValidation), getReview)
  .patch(isValid(updateReviewValidation), updateReview)
  .delete(isValid(idValidation), deleteReview);
//----------------------------
export default reviewRouter;
