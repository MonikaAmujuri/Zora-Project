import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

/* CREATE PAYMENT */
router.post("/create", async (req, res) => {
  try {
    const { userId, method, amount, transactionId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    const payment = await Payment.create({
      userId,
      method,
      amount,
      transactionId,
      status: method === "COD" ? "PENDING" : "SUCCESS",
    });

    res.json(payment);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

/* GET USER PAYMENTS */
router.get("/:userId", async (req, res) => {
  const payments = await Payment.find({
    userId: req.params.userId,
  }).sort({ createdAt: -1 });

  res.json(payments);
});

export default router;