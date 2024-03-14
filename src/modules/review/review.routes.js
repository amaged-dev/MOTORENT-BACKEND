import express from "express";
import { isCreatorUserOrAdmin, protect } from "../../middleware/authMiddlewares.js";
import { addReview, deleteReview, getAllReviewsOnCar, getReview, updateReview } from "./review.controller.js";
import Review from "../../../DB/models/review.model.js";
import { isValid } from '../../middleware/validation.js';
import { idValidation, addReviewValidation, updateReviewValidation } from "./review.validation.js";

const reviewRouter = express.Router();
reviewRouter.get('/getall', async (req, res) => {
  const all = await Review.find();
  res.json(all);
});
reviewRouter.get("/getAllReviewsOnCar/:carId", getAllReviewsOnCar);

reviewRouter.use(protect);

reviewRouter.post("/addReview", isValid(addReviewValidation), addReview);

// prettier-ignore
reviewRouter
  .route("/:id")
  .get(isCreatorUserOrAdmin(Review, 'Review'), isValid(idValidation), getReview)
  .patch(isCreatorUserOrAdmin(Review, 'Review'), isValid(updateReviewValidation), updateReview)
  .delete(isCreatorUserOrAdmin(Review, 'Review'), isValid(idValidation), deleteReview);
//----------------------------
export default reviewRouter;
