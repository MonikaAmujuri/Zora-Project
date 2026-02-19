import express from "express";
import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/firebase-login", async (req, res) => {
  try {
    const { idToken, phoneNumber } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      user = await User.create({
        phone: phoneNumber,
        role: "user",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

      user.isOnline = true;   // ✅ ADD THIS
      await user.save(); 

    res.json({
      _id: user._id,
      phone: user.phone,
      role: user.role,
      isOnline: user.isOnline,
      token,
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
});

export default router;