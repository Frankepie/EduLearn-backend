const express = require("express");

const router = express.Router();

const {
  getCourseProgress
} = require("../controllers/courseProgressController");

const protect =
  require("../middleware/authMiddleware");


router.get(
  "/:courseId",
  protect,
  getCourseProgress
);


module.exports = router;