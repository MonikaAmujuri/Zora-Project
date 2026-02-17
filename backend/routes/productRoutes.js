import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { addProduct, updateProduct } from "../../zora-store/src/services/productApi.js";
import { deleteProduct } from "../../zora-admin/src/services/productApi.js";

const router = express.Router();

/* GET ALL PRODUCTS */
// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET RECENT PRODUCTS
router.get("/recent", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ _id: -1 })
      .limit(5);

    res.json(products);
  } catch (error) {
    console.error("Recent products error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ADD PRODUCT */
router.post("/", authMiddleware, adminMiddleware, addProduct, async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // 👈 ADD THIS

    const product = new Product(req.body);
    const saved = await product.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("Add product error:", error.message); // 👈 IMPORTANT
    res.status(400).json({ message: error.message });
  }
});

/* DELETE PRODUCT */
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE PRODUCT */
router.put("/:id", authMiddleware, adminMiddleware, updateProduct, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


export default router;
