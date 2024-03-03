import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review must have a content"],
    },
    rating: {
      type: Number,
      required: [true, "A review must have a rating"],
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    car: {
      type: mongoose.Schema.ObjectId,
      ref: "Car",
      required: [true, "Review must belong to Car"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (carId) {
  const stats = await this.aggregate([
    {
      $match: { car: carId },
    },
    {
      $group: {
        _id: "$car",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.model("Car").findByIdAndUpdate(carId, {
      averageRating: stats[0].averageRating,
    });
  } else {
    await this.model("Car").findByIdAndUpdate(carId, {
      averageRating: 0,
    });
  }
};

// Middleware to calculate average rating after saving a review
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.car);
});

// Middleware to calculate average rating before removing a review
reviewSchema.pre("remove", function () {
  this.constructor.calculateAverageRating(this.car);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
