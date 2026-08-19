const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    purpose: {
      type: String,
      required: true,
      enum: [
        "registration",
        "password_reset"
      ]
    },

    otpHash: {
      type: String,
      required: true
    },

    attempts: {
      type: Number,
      default: 0
    },

    lastSentAt: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      required: true
    },

    // Temporary registration information.
    // The User document is created only after OTP verification.
    registrationData: {
      name: String,
      passwordHash: String,
      role: String
    },

    // Used after password-reset OTP verification.
    resetTokenHash: {
      type: String
    },

    resetTokenExpiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "OTP",
  otpSchema
);