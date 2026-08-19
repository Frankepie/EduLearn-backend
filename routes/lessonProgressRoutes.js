const express =
  require("express");

const router =
  express.Router();


const {
  markLessonComplete,
  getStudentLessonProgress
} =
  require(
    "../controllers/lessonProgressController"
  );


const protect =
  require(
    "../middleware/authMiddleware"
  );


// GET CURRENT STUDENT'S PROGRESS

router.get(
  "/my-progress",
  protect,
  getStudentLessonProgress
);


// MARK LESSON COMPLETE

router.post(
  "/:lessonId/complete",
  protect,
  markLessonComplete
);

module.exports =
  router;