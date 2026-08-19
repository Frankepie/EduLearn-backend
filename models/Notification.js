const mongoose = require("mongoose");


const notificationSchema =
  new mongoose.Schema(

    {

      // ===================================
      // RECIPIENT
      // ===================================

      recipient: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

      },


      // ===================================
      // TITLE
      // ===================================

      title: {

        type: String,

        required: true,

        trim: true

      },


      // ===================================
      // MESSAGE
      // ===================================

      message: {

        type: String,

        required: true,

        trim: true

      },


      // ===================================
      // TYPE
      // ===================================

      type: {

        type: String,

        enum: [
          "system",
          "user",
          "course",
          "assignment",
          "quiz",
          "certificate",
          "enrollment"
        ],

        default: "system"

      },


      // ===================================
      // READ STATUS
      // ===================================

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
    "Notification",
    notificationSchema
  );