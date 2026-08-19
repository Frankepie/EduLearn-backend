const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    instructions: {
      type: String,
      default: ""
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    dueDate: {
      type: Date,
      default: null
    },

    totalMarks: {
      type: Number,
      default: 100,
      min: 0
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
    "Assignment",
    assignmentSchema
  );