const express = require("express");
const upload = require("../middleware/upload");
const {
  createCourse,
  getCourses,
  getCourseById,
  getInstructorCourses,
  updateCourse,
  deleteCourse
} =
  require(
    "../controllers/courseController"
  );
const protect =
  require("../middleware/authMiddleware");
  const instructorOnly =
  require(
    "../middleware/roleMiddleware"
  );
const router =
  express.Router();
// =====================================
// GET ALL COURSES
// =====================================
router.get(
  "/",
  getCourses
);
router.get(
  "/instructor/my-courses",
  protect,
  instructorOnly,
  getInstructorCourses
);

router.get(
  "/:id",
  getCourseById
);

router.put(
  "/:id",
  protect,
  instructorOnly,
  updateCourse
);

router.delete(
  "/:id",
  protect,
  instructorOnly,
  deleteCourse
);
// =====================================
// CREATE COURSE
// =====================================
router.post(
  "/",
  protect,
  upload.single("image"),
  createCourse
);

module.exports = router;