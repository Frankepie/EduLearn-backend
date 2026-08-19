const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      default: ""
    },

    videoUrl: {
      type: String,
      default: ""
    },

    duration: {
      type: Number,
      default: 0
    },

    order: {
      type: Number,
      required: true,
      default: 1
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    }
  },

  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Lesson",
    lessonSchema
  );