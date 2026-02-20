import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  
    phone: {
      type: String,
      required: true,
      unique: true,
      sparse: true
    },
    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
