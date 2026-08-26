const express = require("express");
const {
  getMyProfile,
  updateMyProfile
} = require("../controllers/userController");
const User = require("../models/User");

const protect =
  require("../middleware/authMiddleware");

const router = express.Router();
const multer = require("multer");
const upload =
  multer({
    storage: multer.memoryStorage(),

    limits: {
      fileSize:
        5 * 1024 * 1024
    },

    fileFilter:
      (req, file, cb) => {

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp"
        ];

        if (
          allowedTypes.includes(
            file.mimetype
          )
        ) {

          cb(null, true);

        } else {

          cb(
            new Error(
              "Only JPEG, PNG, JPG and WebP images are allowed"
            ),
            false
          );

        }

      }
  });
// =====================================
// GET ALL INSTRUCTORS
// PUBLIC ROUTE
// =====================================

router.get(
  "/instructors",
  async (req, res) => {

    try {

      const instructors =
        await User.find(
          {
            role: "instructor"
          },
          {
            name: 1,
            email: 1,
            profileImage: 1,
            role: 1
          }
        )
        .sort({
          createdAt: -1
        });

      res.status(200).json({
        instructors
      });

    } catch (error) {

      console.error(
        "Get instructors error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load instructors"
      });

    }

  }
);

// =====================================
// GET MY PROFILE
// =====================================

router.get(
  "/profile",
  protect,
  getMyProfile
);


// =====================================
// UPDATE MY PROFILE
// =====================================

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateMyProfile
);


module.exports = router;