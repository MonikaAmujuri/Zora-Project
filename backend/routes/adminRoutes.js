import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Contact from "../models/Contact.js";
import AdminSettings from "../models/AdminSettings.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // ===== COUNTS =====
      const totalProducts = await Product.countDocuments();
      const totalUsers = await User.countDocuments({ role: "user" });
      const totalOrders = await Order.countDocuments();
      const productsOnSale = await Product.countDocuments({
            discount: { $gt: 0 }
        });
      const pattuCount = await Product.countDocuments({ category: "pattu" });
      const fancyCount = await Product.countDocuments({ category: "fancy" });
      const cottonCount = await Product.countDocuments({ category: "cotton" });

      // ===== RECENT PRODUCTS (Latest 5) =====
      const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5);

      // ===== OUT OF STOCK =====
      const outOfStockProducts = await Product.find({ stock: 0 });

      res.json({
        totalProducts,
        totalUsers,
        totalOrders,
        productsOnSale,
        pattuCount,
        fancyCount,
        cottonCount,
        recentProducts,
        outOfStockProducts,
      });

    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  GET ALL USERS (Admin only)
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  DELETE USER (Admin only)
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      await User.findByIdAndDelete(id);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  UPDATE USER ROLE
router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  GET ALL ORDERS (Admin only)
router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.error("Admin orders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  GET ALL REVIEWS
router.get(
  "/reviews",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("user", "name email")
        .populate("product", "name image")
        .sort({ createdAt: -1 });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  DELETE REVIEW
router.delete(
  "/reviews/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
      res.json({ message: "Review deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 📊 REVIEW ANALYTICS
router.get(
  "/review-stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalReviews = await Review.countDocuments();

      const avgResult = await Review.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
          },
        },
      ]);

      const averageRating =
        avgResult.length > 0 ? avgResult[0].avgRating : 0;

      res.json({
        totalReviews,
        averageRating: averageRating.toFixed(1),
      });
    } catch (error) {
      console.error("Review stats error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/settings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      let settings = await AdminSettings.findOne();

      if (!settings) {
        settings = await AdminSettings.create({});
      }

      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/settings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      let settings = await AdminSettings.findOne();

      if (!settings) {
        settings = new AdminSettings();
      }

      settings.store = req.body.store;
      settings.payments = req.body.payments;
      settings.notifications = req.body.notifications;

      await settings.save();

      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  GET ADMIN PROFILE
router.get(
  "/profile",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const admin = await User.findById(req.user.id).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json(admin);

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  UPDATE ADMIN PROFILE
router.put(
  "/profile",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { currentPassword, password } = req.body;

      const admin = await User.findById(req.user.id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // 🔐 Check current password
      if (password) {
        const isMatch = await bcrypt.compare(
          currentPassword,
          admin.password
        );

        if (!isMatch) {
          return res.status(400).json({
            message: "Current password incorrect",
          });
        }

        const hashed = await bcrypt.hash(password, 10);
        admin.password = hashed;
      }

      await admin.save();

      res.json({ message: "Profile updated" });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 📊 SALES GRAPH (Monthly Revenue)
router.get("/sales-graph", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);

  } catch (error) {
    console.error("Sales graph error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 GET ALL CONTACT MESSAGES
router.get(
  "/contacts",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/contacts/:id/reply",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { status: "Replied" },
        { new: true }
      );

      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/contacts/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      res.json({ message: "Message deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;