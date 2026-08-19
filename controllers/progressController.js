const LessonProgress =
  require("../models/LessonProgress");

const Course =
  require("../models/Course");


// ==========================================
// GET MY OVERALL PROGRESS
// ==========================================

const getMyProgress =
  async (req, res) => {

    console.log(
      "🔥 NEW getMyProgress CONTROLLER IS RUNNING"
    );
    try {

      const studentId =
        req.user._id;


      // ==========================================
      // GET STUDENT PROGRESS
      // ==========================================

      const progress =
        await LessonProgress.find({
          student: studentId
        })
        .populate({
          path: "lesson",
          populate: {
            path: "module",
            select: "course"
          }
        });


      // ==========================================
      // COUNT LESSON PROGRESS
      // ==========================================

      const completedLessons =
        progress.filter(
          item =>
            item.completed === true
        ).length;


      const totalLessons =
        progress.length;


      let percentage = 0;


      if (totalLessons > 0) {

        percentage =
          Math.round(
            (
              completedLessons /
              totalLessons
            ) * 100
          );

      }


      // ==========================================
      // FIND COURSES FROM PROGRESS
      // ==========================================

      const courseIds = [
        ...new Set(
          progress
            .filter(
              item =>
                item.lesson &&
                item.lesson.module &&
                item.lesson.module.course
            )
            .map(
              item =>
                item.lesson.module.course.toString()
            )
        )
      ];


      // ==========================================
      // GET COURSE INFORMATION
      // ==========================================

      const courses =
        await Course.find({
          _id: {
            $in: courseIds
          }
        })
        .select(
          "title description category"
        );


      // ==========================================
      // CALCULATE EACH COURSE PROGRESS
      // ==========================================

      const courseProgress =
        courseIds.map(
          courseId => {

            const courseLessons =
              progress.filter(
                item =>
                  item.lesson &&
                  item.lesson.module &&
                  item.lesson.module.course &&
                  item.lesson.module.course.toString() ===
                    courseId
              );


            const courseCompleted =
              courseLessons.filter(
                item =>
                  item.completed === true
              ).length;


            const courseTotal =
              courseLessons.length;


            const coursePercentage =
              courseTotal > 0
                ? Math.round(
                    (
                      courseCompleted /
                      courseTotal
                    ) * 100
                  )
                : 0;


            const course =
              courses.find(
                item =>
                  item._id.toString() ===
                  courseId
              );


            return {

              courseId,

              title:
                course
                  ? course.title
                  : "Unknown Course",

              description:
                course
                  ? course.description
                  : "",

              category:
                course
                  ? course.category
                  : "",

              completedLessons:
                courseCompleted,

              totalLessons:
                courseTotal,

              percentage:
                coursePercentage,

              completed:
                coursePercentage === 100

            };

          }
        );


      // ==========================================
      // SEND RESPONSE
      // ==========================================

      return res.status(200).json({

        totalCourses:
          courseProgress.length,

        completedLessons,

        totalLessons,

        percentage,

        courses:
          courseProgress

      });


    } catch (error) {

      console.error(
        "Error loading overall progress:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to load progress",

        error:
          error.message

      });

    }

  };


// ==========================================
// GET COURSE COMPLETION
// ==========================================

const getCourseCompletion =
  async (req, res) => {

    try {

      const studentId =
        req.user._id;

      const { courseId } =
        req.params;


      // ==========================================
      // GET PROGRESS RECORDS
      // ==========================================

      const progressRecords =
        await LessonProgress
          .find({
            student: studentId
          })
          .populate({
            path: "lesson",
            populate: {
              path: "module",
              select: "course"
            }
          });


      // ==========================================
      // FILTER COURSE LESSONS
      // ==========================================

      const courseProgress =
        progressRecords.filter(
          record =>
            record.lesson &&
            record.lesson.module &&
            record.lesson.module.course &&
            record.lesson.module.course.toString() ===
              courseId.toString()
        );


      // ==========================================
      // NO LESSONS
      // ==========================================

      if (
        courseProgress.length === 0
      ) {

        return res.status(200).json({

          completed: false,

          progress: 0,

          completedLessons: 0,

          totalLessons: 0

        });

      }


      // ==========================================
      // COUNT COMPLETED
      // ==========================================

      const completedLessons =
        courseProgress.filter(
          record =>
            record.completed === true
        );


      const totalLessons =
        courseProgress.length;


      const completedCount =
        completedLessons.length;


      const percentage =
        Math.round(

          (
            completedCount /
            totalLessons
          ) * 100

        );


      const completed =
        percentage === 100;


      return res.status(200).json({

        completed,

        progress:
          percentage,

        completedLessons:
          completedCount,

        totalLessons

      });


    } catch (error) {

      console.error(
        "Error checking course completion:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to check course completion",

        error:
          error.message

      });

    }

  };


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

  getMyProgress,
 
  getCourseCompletion

};