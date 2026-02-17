import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    store: {
      name: { type: String, default: "ZORA" },
      email: { type: String, default: "support@zora.com" },
      currency: { type: String, default: "INR" },
      tax: { type: Number, default: 5 },
      maintenance: { type: Boolean, default: false },
    },

    payments: {
      cod: { type: Boolean, default: true },
      upi: { type: Boolean, default: false },
      card: { type: Boolean, default: false },
      gatewayKey: { type: String, default: "" },
    },

    notifications: {
      newOrder: { type: Boolean, default: true },
      statusChange: { type: Boolean, default: false },
      lowStock: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminSettings", adminSettingsSchema);