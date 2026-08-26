const express = require("express");

const router = express.Router();


// =====================================
// CONTROLLERS
// =====================================

const {
  createLesson,
  getModuleLessons,
  updateLesson,
  deleteLesson
} = require("../controllers/lessonController");


// =====================================
// MIDDLEWARE
// =====================================

const protect =
  require("../middleware/authMiddleware");

const instructorOnly =
  require("../middleware/instructorMiddleware");

const videoUpload =
  require("../middleware/videoUpload");


// =====================================
// GET LESSONS BY MODULE
// =====================================

router.get(
  "/module/:moduleId",
  protect,
  getModuleLessons
);


// =====================================
// CREATE LESSON
// VIDEO UPLOAD OPTIONAL
// =====================================

router.post(
  "/",
  protect,
  instructorOnly,
  videoUpload.single("video"),
  createLesson
);


// =====================================
// UPDATE LESSON
// VIDEO UPLOAD OPTIONAL
// =====================================

router.put(
  "/:id",
  protect,
  instructorOnly,
  videoUpload.single("video"),
  updateLesson
);


// =====================================
// DELETE LESSON
// =====================================

router.delete(
  "/:id",
  protect,
  instructorOnly,
  deleteLesson
);


module.exports = router;