const mongoose = require("mongoose");

const assignmentSubmissionSchema =
  new mongoose.Schema(
    {
      assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
      },

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      answer: {
        type: String,
        required: true,
        trim: true
      },

      submittedAt: {
        type: Date,
        default: Date.now
      },

      status: {
        type: String,
        enum: [
          "Submitted",
          "Graded"
        ],
        default: "Submitted"
      },

      marks: {
        type: Number,
        default: null
      },

      feedback: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true
    }
  );


// Prevent duplicate submissions
// for the same student and assignment

assignmentSubmissionSchema.index(
  {
    assignment: 1,
    student: 1
  },
  {
    unique: true
  }
);


module.exports =
  mongoose.model(
    "AssignmentSubmission",
    assignmentSubmissionSchema
  );