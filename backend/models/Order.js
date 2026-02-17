import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
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
  },
  { timestamps: true } // ✅ createdAt, updatedAt
);

export default mongoose.model("Order", orderSchema);
