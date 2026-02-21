import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        finalPrice: Number,
        discount: Number,
        qty: Number,
      },
    ],

    address: {
      name: String,
      phone: String,
      street: String,
      city: String,
      pincode: String,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    status: {
      type: String,
      default: "Pending", // Pending | Shipped | Delivered | Cancelled
    },
    cancelReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true } // ✅ createdAt, updatedAt
);

export default mongoose.model("Order", orderSchema);
