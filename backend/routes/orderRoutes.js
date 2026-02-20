import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


// ============================
// CREATE ORDER (USER)
// ============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id, // 🔥 Always attach logged in user
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("ORDER SAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ============================
// GET ALL ORDERS (ADMIN)
// ============================
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone") // 🔥 populate phone only
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/test", (req, res) => {
  res.json({ message: "TEST OK" });
});

// GET LOGGED IN USER ORDERS
// ============================
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("USER ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE ORDER (ONLY FOR OWNER)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 Make sure user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// ============================
// UPDATE ORDER STATUS (ADMIN)
// ============================
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ============================
// CANCEL ORDER (USER)
// ============================
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "Cancelled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

export default router;