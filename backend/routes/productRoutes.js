import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { deleteProduct } from "../../zora-admin/src/services/productApi.js";

const router = express.Router();

/* GET ALL PRODUCTS */
// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const { category, subcategory } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

  const products = await Product.find(filter);
  console.log(products);
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
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const product = new Product(req.body);
    const saved = await product.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("Add product error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

/* DELETE PRODUCT */
router.delete("/:id", authMiddleware, adminMiddleware,  async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE PRODUCT */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.subCategory = req.body.subCategory || product.subCategory;
    product.countInStock = req.body.countInStock || product.countInStock;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
