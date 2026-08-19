const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");


// =====================================
// CREATE COURSE
// =====================================

const createCourse = async (
  req,
  res
) => {

  try {

    const {title,description,category,level,duration,price,image} = req.body;
    if (
      !title ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Title, description and category are required"
      });
    }
    const course =
      await Course.create({
        title,
        description,
        category,
        level,
        duration,
        price,
        image,
        instructor:
          req.user.id
      });
    res.status(201).json({
      message:
        "Course created successfully",
      course
    });
  } catch (error) {
    console.error(
      "Create course error:",
      error
    );
    res.status(500).json({
      message: "Server error"
    });
  }
};

// =====================================
// GET ALL COURSES
// =====================================

const getCourses = async (req,res) => {
  try {
    const courses =
      await Course.find()
        .populate(
          "instructor",
          "name email"
        )
        .sort({
          createdAt: -1
        });
    res.status(200).json({
      courses
    });
  } catch (error) {
    console.error(
      "Get courses error:",
      error
    );
    res.status(500).json({
      message: "Server error"
    });
  }
};

// =====================================
// GET SINGLE COURSE
// =====================================
const getCourseById = async (
  req,
  res
) => {
  try {
    const course =
      await Course.findById(
        req.params.id
      ).populate(
        "instructor",
        "name email"
      );
    if (!course) {
      return res.status(404).json({
        message:
          "Course not found"
      });
    }
    res.status(200).json({
      course
    });
  } catch (error) {
    console.error(
      "Get course error:",
      error
    );
    res.status(500).json({
      message: "Server error"
    });
  }
};

const getInstructorCourses = async (req, res) => {
  try {

    const courses = await Course.find({
      instructor: req.user.id
    })
      .sort({
        createdAt: -1
      });

    const courseIds = courses.map(
      (course) => course._id
    );

    const totalStudents =
      await Enrollment.countDocuments({
        course: {
          $in: courseIds
        }
      });

    res.status(200).json({
      courses,
      totalStudents
    });

  } catch (error) {

    console.error(
      "Instructor courses error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};
  const updateCourse =
  async (req, res) => {
    try {
      const course =
        await Course.findById(
          req.params.id
        );
      if (!course) {
        return res.status(404).json({
          message:
            "Course not found"
        });
      }
      if (
        course.instructor.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "You can only edit your own courses"
        });
      }
      const updatedCourse =
        await Course.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );
      res.status(200).json({
        message:
          "Course updated successfully",
        course:
          updatedCourse
      });
    } catch (error) {
      console.error(
        "Update course error:",
        error
      );
      res.status(500).json({
        message: "Server error"
      });
    }

  };

  const deleteCourse =
  async (req, res) => {
    try {
      const course =
        await Course.findById(
          req.params.id
        );
      if (!course) {
        return res.status(404).json({
          message:
            "Course not found"
        });
      }
      if (
        course.instructor.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "You can only delete your own courses"
        });
      }
      await Course.findByIdAndDelete(
        req.params.id
      );
      res.status(200).json({
        message:
          "Course deleted successfully"
      });
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );
      res.status(500).json({
        message: "Server error"
      });
    }
  };
module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getInstructorCourses,
  updateCourse,
  deleteCourse
};