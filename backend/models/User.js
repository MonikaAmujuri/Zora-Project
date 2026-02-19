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
    email: {
      type: String,
      required: function () {
        return !this.phone; // email required only if phone not provided
      },
      unique: true,
      sparse: true,
      default: undefined  
    },

    phone: {
      type: String,
      required: function () {
        return !this.email; // phone required only if email not provided
      },
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: function () {
        return this.email != null;
      }
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
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
