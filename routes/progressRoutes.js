const express = require("express");

const router = express.Router();

const {
  getMyProgress,
  getCourseCompletion
} = require("../controllers/progressController");

const authMiddleware =
  require("../middleware/authMiddleware");


// Overall student progress
router.get(
  "/my-progress",
  authMiddleware,
  getMyProgress
);


// Course completion
router.get(
  "/course/:courseId/completion",
  authMiddleware,
  getCourseCompletion
);


module.exports = router;