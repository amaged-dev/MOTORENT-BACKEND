import express from "express";
import { isCreatorUserOrAdmin, protect } from "../../middleware/authMiddlewares.js";
import { addReview, deleteReview, getAllReviewsOnCar, getReview, updateReview } from "./review.controller.js";
import Review from "../../../DB/models/review.model.js";

const reviewRouter = express.Router();


reviewRouter.get("/getAllReviewsOnCar", getAllReviewsOnCar);

reviewRouter.use(protect);

reviewRouter.post("/add-review", addReview);

reviewRouter.use(isCreatorUserOrAdmin(Review, 'Review'));
// prettier-ignore
reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);
//----------------------------
export default reviewRouter;
