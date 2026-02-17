import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

/* TEST */
router.get("/test", (req, res) => {
  res.json({ message: "Cart API working" });
});

/* ADD TO CART */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing data" });
    }

    // ensure product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // create new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // check existing product
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    res.json({ message: "Added to cart successfully" });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET CART */
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId })
    .populate("items.productId");

  if (!cart) return res.json({ items: [] });

  const items = cart.items.map(i => {
    const p = i.productId;
    const finalPrice =
      p.discount > 0
        ? Math.round(p.price - (p.price * p.discount) / 100)
        : p.price;

    return {
      id: p._id,
      name: p.name,
      image: p.image,
      price: p.price,
      discount: p.discount || 0,
      finalPrice,
      qty: i.quantity,
    };
  });

  res.json({ items });
});

/* REMOVE ITEM */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ message: "Cart empty" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/clear", async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ message: "Cart already empty" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

/* UPDATE QUANTITY */
router.put("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;

    await cart.save();

    res.json({ message: "Quantity updated successfully" });

  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;