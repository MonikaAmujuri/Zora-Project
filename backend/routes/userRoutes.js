import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();

// 🔥 GET ALL USERS (Admin only)
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      res.json(users);
    } catch (error) {
      console.error("GET USERS ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔥 DELETE USER (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deleting yourself (optional but smart)
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "You cannot delete yourself" });
      }

      await user.deleteOne();

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔥 UPDATE USER ROLE (Admin only)
router.put(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      res.json({ message: "Role updated successfully", user });
    } catch (error) {
      console.error("ROLE UPDATE ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, password } = req.body;

    const updateData = { name };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,   // 🔥 VERY IMPORTANT
      updateData,
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;