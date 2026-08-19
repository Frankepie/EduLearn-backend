const express = require("express");

const router = express.Router();

const {
  getAllUsers
} = require("../controllers/adminUserController");

const protect = require("../middleware/authMiddleware");


// =====================================
// GET ALL USERS
// Admin only
// =====================================

router.get(
  "/",
  protect,
  (req, res, next) => {

    if (req.user.role !== "admin") {

      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });

    }

    next();
  },
  getAllUsers
);


module.exports = router;