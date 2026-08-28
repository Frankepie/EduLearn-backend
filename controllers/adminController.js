
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");

// ==========================================
// GET ADMIN DASHBOARD
// ==========================================

const getAdminDashboard = async (req, res) => {
  try {
    // ==========================================
    // BASIC STATISTICS
    // ==========================================

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

    // ==========================================
    // USERS OVERVIEW — LAST 6 MONTHS
    // ==========================================

    const sixMonthsAgo = new Date();

    sixMonthsAgo.setMonth(
      sixMonthsAgo.getMonth() - 5
    );

    sixMonthsAgo.setDate(1);

    sixMonthsAgo.setHours(
      0,
      0,
      0,
      0
    );

    const monthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sixMonthsAgo
          }
        }
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },

            month: {
              $month: "$createdAt"
            }
          },

          count: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // ==========================================
    // BUILD LAST 6 MONTHS
    // ==========================================

    const usersOverview = [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();

      date.setMonth(
        date.getMonth() - i
      );

      const year =
        date.getFullYear();

      const month =
        date.getMonth() + 1;

      const found =
        monthlyUsers.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month
        );

      usersOverview.push({
        label:
          monthNames[month - 1],

        value:
          found
            ? found.count
            : 0
      });
    }

    // ==========================================
    // COURSES BY CATEGORY
    // ==========================================

    const coursesByCategory =
      await Course.aggregate([
        {
          $group: {
            _id: "$category",

            count: {
              $sum: 1
            }
          }
        },

        {
          $sort: {
            count: -1
          }
        }
      ]);

    const formattedCategories =
      coursesByCategory.map(
        (item) => ({
          label:
            item._id || "Other",

          value:
            item.count
        })
      );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        totalCertificates
      },

      usersOverview,

      coursesByCategory:
        formattedCategories
    });

  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load admin dashboard",

      error:
        error.message
    });
  }
};


// ==========================================
// GET ALL USERS
// ==========================================

const getAdminUsers = async (req, res) => {
  try {
    const users =
      await User.find()
        .select(
          "name fullName email role profileImage createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean();

    return res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error(
      "Admin users error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load users",

      error:
        error.message
    });
  }
};


// ==========================================
// GET ALL COURSES
// ==========================================

const getAdminCourses = async (req, res) => {
  try {
    const courses =
      await Course.find()
        .populate(
          "instructor",
          "name fullName email"
        )
        .sort({
          createdAt: -1
        })
        .lean();

    return res.status(200).json({
      success: true,
      courses
    });

  } catch (error) {
    console.error(
      "Admin courses error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load courses",

      error:
        error.message
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
          "name fullName email"
        )
        .populate(
          "course",
          "title image category"
        )
        .sort({
          createdAt: -1
        })
        .lean();

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

      message:
        "Failed to load enrollments",

      error:
        error.message
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
          "name fullName email"
        )
        .populate(
          "course",
          "title"
        )
        .sort({
          createdAt: -1
        })
        .lean();

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

      message:
        "Failed to load certificates",

      error:
        error.message
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  getAdminCourses,
  getAdminEnrollments,
  getAdminCertificates
};
