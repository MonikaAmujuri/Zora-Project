import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    method: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);