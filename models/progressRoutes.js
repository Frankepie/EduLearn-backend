const express = require("express");

const router = express.Router();

const {
  getMyProgress,
  getCourseCompletion
} =
  require("../controllers/progressController");

const authMiddleware =
  require("../middleware/authMiddleware");


// ==========================================
// MY OVERALL PROGRESS
// ==========================================

router.get(
  "/my-progress",
  authMiddleware,
  getMyProgress
);


// ==========================================
// COURSE COMPLETION
// ==========================================

router.get(
  "/course/:courseId/completion",
  authMiddleware,
  getCourseCompletion
);


module.exports = router;