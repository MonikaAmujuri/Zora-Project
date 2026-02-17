import express from "express";
import Wishlist from "../models/Wishlist.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================
   GET WISHLIST COUNT
====================== */
router.get("/count", protect, async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  res.json({ count: wishlist ? wishlist.items.length : 0 });
});

/* ======================
   TOGGLE WISHLIST
====================== */
router.post("/toggle", protect, async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, items: [] });
  }

  const exists = wishlist.items.find(
    (item) => item.product.toString() === productId
  );

  if (exists) {
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );
  } else {
    wishlist.items.push({ product: productId });
  }

  await wishlist.save();
  res.json({ count: wishlist.items.length });
});

/* ======================
   GET FULL WISHLIST
====================== */
router.get("/", protect, async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("items.product");

  res.json(wishlist || { items: [] });
});

export default router;