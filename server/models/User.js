const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    phone: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    specialization: { type: String },
    experience: { type: Number },
    fees: { type: Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User".userSchema);
