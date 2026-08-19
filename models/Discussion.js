const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    // Optional for general student discussions.
    // A discussion can later be connected to a course.
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
      default: null
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        content: {
          type: String,
          required: true,
          trim: true
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Discussion",
    discussionSchema
  );