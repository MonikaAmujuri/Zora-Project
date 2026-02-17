import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();

/* CREATE ORDER */
router.post("/", authMiddleware, async (req, res) => {
  try { 
    console.log("ORDER BODY:", req.body);
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("ORDER SAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL ORDERS (ADMIN) */
router.get("/", authMiddleware, adminMiddleware,  async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* GET ORDER BY ID */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* GET USER ORDERS */
router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      userEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE ORDER STATUS (ADMIN) */
router.put("/:id", authMiddleware, adminMiddleware,  async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
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

    /* CANCEL ORDER */
router.put("/cancel/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
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
    console.error("CANCEL ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

export default router;
