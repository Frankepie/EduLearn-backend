const LessonProgress =
  require("../models/LessonProgress");

const Lesson =
  require("../models/Lesson");


// MARK LESSON AS COMPLETE

const markLessonComplete =
  async (req, res) => {

    try {

      const {
        lessonId
      } = req.params;


      const studentId =
        req.user._id;


      const lesson =
        await Lesson.findById(
          lessonId
        );


      if (!lesson) {

        return res.status(404).json({

          message:
            "Lesson not found"

        });

      }


      let progress =
        await LessonProgress.findOne({

          student: studentId,

          lesson: lessonId

        });


      if (!progress) {

        progress =
          await LessonProgress.create({

            student: studentId,

            lesson: lessonId,

            completed: true,

            completedAt:
              new Date()

          });

      } else {

        progress.completed =
          true;

        progress.completedAt =
          new Date();

        await progress.save();

      }


      res.json({

        message:
          "Lesson marked as complete",

        progress

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Failed to update lesson progress",

        error:
          error.message

      });

    }

  };


// GET STUDENT PROGRESS

const getStudentLessonProgress =
  async (req, res) => {

    try {

      const studentId =
        req.user._id;


      const progress =
        await LessonProgress.find({

          student: studentId

        }).populate(
          "lesson"
        );


      res.json({

        progress

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Failed to get lesson progress",

        error:
          error.message

      });

    }

  };


module.exports = {

  markLessonComplete,

  getStudentLessonProgress

};