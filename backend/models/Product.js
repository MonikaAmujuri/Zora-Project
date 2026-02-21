import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    desc: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    subCategory: {
      type: String,
      required: [true, "Sub-category is required"],
      default: "",
    },

    discount: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 10,
    },

    color: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
