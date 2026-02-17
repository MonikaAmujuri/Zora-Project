import express from "express";
import Address from "../models/Address.js";

const router = express.Router();

/* ADD ADDRESS */
router.post("/add", async (req, res) => {
  try {
    const address = new Address(req.body);

    // if default → unset previous defaults
    if (req.body.isDefault) {
      await Address.updateMany(
        { userId: req.body.userId },
        { isDefault: false }
      );
    }

    await address.save();
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Add address failed" });
  }
});

/* GET USER ADDRESSES */
router.get("/:userId", async (req, res) => {
  const addresses = await Address.find({
    userId: req.params.userId,
  }).sort({ isDefault: -1, createdAt: -1 });

  res.json(addresses);
});

/* DELETE ADDRESS */
router.delete("/:id", async (req, res) => {
  await Address.findByIdAndDelete(req.params.id);
  res.json({ message: "Address removed" });
});

export default router;