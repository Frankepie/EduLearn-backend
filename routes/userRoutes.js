const express = require("express");

const User = require("../models/User");

const protect =
  require("../middleware/authMiddleware");

const router = express.Router();


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
// PROTECTED PROFILE
// =====================================

router.get(
  "/profile",
  protect,
  (req, res) => {

    res.json({
      message:
        "Protected profile route works",

      user: req.user
    });

  }
);


module.exports = router;