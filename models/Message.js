const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    messageType: {
      type: String,
      enum: [
        "text",
        "voice"
      ],
      default: "text"
    },

    text: {
      type: String,
      trim: true,
      default: ""
    },

    audioUrl: {
      type: String,
      default: ""
    },

    read: {
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
    "Message",
    messageSchema
  );