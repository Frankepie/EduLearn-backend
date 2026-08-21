const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    lastMessageAt: {
      type: Date,
      default: null
    }
  },

  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Conversation",
    conversationSchema
  );