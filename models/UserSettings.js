const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema(
  {
    // =====================================
    // USER
    // =====================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },


    // =====================================
    // APPEARANCE
    // =====================================

    darkMode: {
      type: Boolean,
      default: false
    },


    // =====================================
    // LANGUAGE
    // =====================================

    language: {
      type: String,
      enum: [
        "English",
        "French"
      ],
      default: "English"
    },


    // =====================================
    // NOTIFICATIONS
    // =====================================

    notifications: {

      email: {
        type: Boolean,
        default: true
      },

      courses: {
        type: Boolean,
        default: true
      },

      assignments: {
        type: Boolean,
        default: true
      }

    }

  },

  {
    timestamps: true
  }
);


module.exports =
  mongoose.model(
    "UserSettings",
    userSettingsSchema
  );