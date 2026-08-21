const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ==========================================
// CHECK COURSE COMMUNICATION ACCESS
// ==========================================

const checkCourseCommunicationAccess =
  async (req, res, next) => {

    try {

      const courseId =
        req.params.courseId ||
        req.body.courseId;

      if (!courseId) {
        return res.status(400).json({
          message:
            "Course ID is required"
        });
      }

     const course =
  await Course.findById(courseId)
    .populate(
      "instructor",
      "name email profileImage role"
    );

      if (!course) {
        return res.status(404).json({
          message:
            "Course not found"
        });
      }

      // =====================================
      // ADMIN
      // =====================================

      if (
        req.user.role?.toLowerCase() ===
        "admin"
      ) {

        req.communicationCourse =
          course;

        req.isForumAdmin = true;

        return next();
      }

      // =====================================
      // INSTRUCTOR
      // =====================================

      if (
        req.user.role?.toLowerCase() ===
        "instructor"
      ) {

        if (
          course.instructor.toString() !==
          req.user.id.toString()
        ) {

          return res.status(403).json({
            message:
              "You can only manage communication for your own courses"
          });

        }

        req.communicationCourse =
          course;

        req.isForumAdmin = true;

        return next();
      }

      // =====================================
      // STUDENT
      // =====================================

      if (
        req.user.role?.toLowerCase() ===
        "student"
      ) {

        const enrollment =
          await Enrollment.findOne({
            student: req.user.id,
            course: courseId
          });

        if (!enrollment) {

          return res.status(403).json({
            message:
              "You must be enrolled in this course to access its communication"
          });

        }

        req.communicationCourse =
          course;

        req.isForumAdmin = false;

        return next();
      }

      // =====================================
      // UNKNOWN ROLE
      // =====================================

      return res.status(403).json({
        message:
          "You are not authorized to access course communication"
      });

    } catch (error) {

      console.error(
        "Communication authorization error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error"
      });

    }
  };

module.exports =
  checkCourseCommunicationAccess;