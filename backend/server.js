import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */

app.use(
  cors({
    origin: [
      "http://localhost:5173", // zora-store
      "http://localhost:5174", // zora-admin
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("ZORA API running");
});

/* PRODUCT ROUTES */
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);


/* DB CONNECT */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port 5000 `);
    });
  })
  .catch((err) => {
    console.error("DB error:", err.message);
  });
