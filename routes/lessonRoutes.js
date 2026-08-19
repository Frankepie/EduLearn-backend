const express =
  require("express");

const router =
  express.Router();


const {
  createLesson,
  getModuleLessons,
  updateLesson,
  deleteLesson
} =
  require("../controllers/lessonController");


const protect =
  require("../middleware/authMiddleware");


const instructorOnly =
  require("../middleware/instructorMiddleware");


// GET LESSONS

router.get(
  "/module/:moduleId",
  protect,
  getModuleLessons
);


// CREATE LESSON

router.post(
  "/",
  protect,
  instructorOnly,
  createLesson
);


// UPDATE LESSON

router.put(
  "/:id",
  protect,
  instructorOnly,
  updateLesson
);


// DELETE LESSON

router.delete(
  "/:id",
  protect,
  instructorOnly,
  deleteLesson
);

module.exports =
  router;