 const Enrollment =
  require("../models/Enrollment");

const Course =
  require("../models/Course");


// =====================================
// ENROLL IN COURSE
// =====================================

const enrollInCourse =
  async (req, res) => {
    try {
      const {
        courseId
      } = req.body;
      if (!courseId) {
        return res.status(400).json({
          message:
            "Course ID is required"
        });
      }
      const course =
        await Course.findById(
          courseId
        );
      if (!course) {
        return res.status(404).json({
          message:
            "Course not found"
        });
      }
      const existingEnrollment =
        await Enrollment.findOne({
          student:
            req.user.id,
          course:
            courseId
        });
      if (existingEnrollment) {
        return res.status(400).json({
          message:
            "You are already enrolled in this course"
        });
      }
      const enrollment =
        await Enrollment.create({
          student:
            req.user.id,
          course:
            courseId

        });
      res.status(201).json({
        message:
          "Successfully enrolled",
        enrollment
      });
    } catch (error) {
      console.error(
        "Enrollment error:",
        error
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  };

// =====================================
// GET MY COURSES
// =====================================

const getMyCourses =
  async (req, res) => {
    try {
      const enrollments =
        await Enrollment.find({
          student:
            req.user.id
        })
        .populate("course")
        .sort({
          createdAt: -1
        });

      res.status(200).json({
        enrollments
      });
    } catch (error) {
      console.error(
        "Get enrolled courses error:",
        error
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  };
  const getInstructorStudents = async (req, res) => {
  try {

    const enrollments =
      await Enrollment.find()
        .populate({
          path: "course",
          match: {
            instructor: req.user.id
          },
          select:
            "title category"
        })
        .populate({
          path: "student",
          select:
            "fullName name email"
        })
        .sort({
          createdAt: -1
        });


    const instructorEnrollments =
      enrollments.filter(
        enrollment =>
          enrollment.course !== null
      );


    res.status(200).json({
      students:
        instructorEnrollments
    });


  } catch (error) {

    console.error(
      "Instructor students error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};
module.exports = {
  enrollInCourse,
  getMyCourses,
  getInstructorStudents
};