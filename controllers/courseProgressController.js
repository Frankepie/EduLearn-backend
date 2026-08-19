const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const LessonProgress = require("../models/LessonProgress");


// ==========================================
// GET COURSE PROGRESS
// ==========================================

const getCourseProgress = async (req, res) => {
  try {

    const { courseId } = req.params;

    // --------------------------------------
    // Find all modules belonging to course
    // --------------------------------------

    const modules = await Module.find({
      course: courseId
    });

    if (!modules || modules.length === 0) {

      return res.json({
        courseId,
        totalLessons: 0,
        completedLessons: 0,
        percentage: 0
      });

    }


    // --------------------------------------
    // Get module IDs
    // --------------------------------------

    const moduleIds = modules.map(
      (module) => module._id
    );


    // --------------------------------------
    // Find lessons inside those modules
    // --------------------------------------

    const lessons = await Lesson.find({
      module: {
        $in: moduleIds
      }
    });


    const totalLessons = lessons.length;


    // --------------------------------------
    // Get lesson IDs
    // --------------------------------------

    const lessonIds = lessons.map(
      (lesson) => lesson._id
    );


    // --------------------------------------
    // Find completed lessons
    // for current student
    // --------------------------------------

    const progress =
      await LessonProgress.find({
        student: req.user._id,

        lesson: {
          $in: lessonIds
        },

        completed: true
      });


    const completedLessons =
      progress.length;


    // --------------------------------------
    // Calculate percentage
    // --------------------------------------

    let percentage = 0;

    if (totalLessons > 0) {

      percentage = Math.round(
        (completedLessons /
          totalLessons) *
          100
      );

    }


    // --------------------------------------
    // Send response
    // --------------------------------------

    res.json({

      courseId,

      totalLessons,

      completedLessons,

      percentage

    });


  } catch (error) {

    console.error(
      "Course progress error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to load course progress",

      error:
        error.message

    });

  }
};

module.exports = {
  getCourseProgress
};