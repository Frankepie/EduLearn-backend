const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced"
      ],
      default: "Beginner"
    },
    duration: {
      type: String,
      default: "0 hours"
    },
    price: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: ""
    },
    published: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
module.exports =
  mongoose.model(
    "Course",
    courseSchema
  );