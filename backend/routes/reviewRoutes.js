import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

const router = express.Router();

// POST review
router.post("/", async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;

    // 🔥 CHECK IF USER ALREADY REVIEWED
    const existingReview = await Review.findOne({
      user,
      product,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      user,
      product,
      rating,
      comment,
    });

    await review.save();

    // 🔥 UPDATE PRODUCT RATING
    const reviews = await Review.find({ product });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(product, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json({ message: "Review added successfully" });

  } catch (error) {
    console.error("Review save error:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE REVIEW
router.put("/:id", async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    // 🔥 Recalculate product rating
    const reviews = await Review.find({
      product: review.product,
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.json({ message: "Review updated successfully" });

  } catch (error) {
    console.error("Review update error:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE REVIEW
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    // 🔥 Recalculate product rating
    const reviews = await Review.find({
      product: productId,
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    console.error("Review delete error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET reviews by product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    console.error("Review fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;