const multer = require("multer");

const storage = multer.memoryStorage();

const videoUpload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-matroska"
    ];

    if (allowedTypes.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only MP4, WEBM, MOV and MKV videos are allowed."
        )
      );

    }

  }

});

module.exports = videoUpload;