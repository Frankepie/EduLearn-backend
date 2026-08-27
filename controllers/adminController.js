const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");

// ==========================================
// GET ADMIN DASHBOARD
// ==========================================

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
      totalCertificates
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "student"
      }),

      User.countDocuments({
        role: "instructor"
      }),

      Course.countDocuments(),

      Enrollment.countDocuments(),

      Certificate.countDocuments()
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        totalCertificates
      }
    });

  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard"
    });
  }
};


// ==========================================
// GET ALL COURSES
// ==========================================

const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate(
        "instructor",
        "name email"
      )
      .sort({
        createdAt: -1
      })
      .lean();

    // Add enrollment count to every course
    const coursesWithStats =
      await Promise.all(
        courses.map(async (course) => {

          const enrollmentCount =
            await Enrollment.countDocuments({
              course: course._id
            });

          return {
            ...course,
            enrollmentCount
          };
        })
      );

    return res.status(200).json({
      success: true,
      courses: coursesWithStats
    });

  } catch (error) {
    console.error(
      "Admin courses error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load courses"
    });
  }
};


// ==========================================
// GET ALL ENROLLMENTS
// ==========================================

const getAdminEnrollments = async (req, res) => {
  try {
    const enrollments =
      await Enrollment.find()
        .populate(
          "student",
          "name email profileImage"
        )
        .populate({
          path: "course",
          select:
            "title category level instructor",
          populate: {
            path: "instructor",
            select: "name email"
          }
        })
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      success: true,
      enrollments
    });

  } catch (error) {
    console.error(
      "Admin enrollments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load enrollments"
    });
  }
};


// ==========================================
// GET ALL CERTIFICATES
// ==========================================

const getAdminCertificates = async (req, res) => {
  try {
    const certificates =
      await Certificate.find()
        .populate(
          "student",
          "name email profileImage"
        )
        .populate({
          path: "course",
          select:
            "title category instructor",
          populate: {
            path: "instructor",
            select: "name email"
          }
        })
        .sort({
          issuedAt: -1
        });

    return res.status(200).json({
      success: true,
      certificates
    });

  } catch (error) {
    console.error(
      "Admin certificates error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load certificates"
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getAdminDashboard,
  getAdminCourses,
  getAdminEnrollments,
  getAdminCertificates
};