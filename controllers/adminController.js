const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Notification =
  require("../models/Notification");

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================

const getAdminDashboard = async (req, res) => {

  try {

    // ======================================
    // BASIC COUNTS
    // ======================================

    const totalUsers =
      await User.countDocuments();

    const totalStudents =
      await User.countDocuments({
        role: "student"
      });

    const totalInstructors =
      await User.countDocuments({
        role: "instructor"
      });

    const totalCourses =
      await Course.countDocuments();

    const totalEnrollments =
      await Enrollment.countDocuments();
// ======================================
// ADMIN UNREAD NOTIFICATIONS
// ======================================

const unreadNotifications =
  await Notification.countDocuments({

    recipient: req.user._id,

    read: false

  });

    // ======================================
    // USERS OVERVIEW
    // ======================================
    // Group users by month.
    //
    // This uses the actual createdAt field
    // stored in MongoDB.
    // ======================================

    const usersOverviewRaw =
      await User.aggregate([

        {
          $match: {
            createdAt: {
              $exists: true
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

            value: {
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


    const usersOverview =
      usersOverviewRaw.map(
        (item) => ({

          label:
            monthNames[
              item._id.month - 1
            ],

          value:
            item.value,

          year:
            item._id.year,

          month:
            item._id.month

        })
      );


    // ======================================
    // COURSES BY CATEGORY
    // ======================================
    // Group actual courses according to
    // their category field.
    // ======================================

    const coursesByCategoryRaw =
      await Course.aggregate([

        {
          $match: {
            category: {
              $exists: true,
              $ne: ""
            }
          }
        },

        {
          $group: {

            _id: "$category",

            value: {
              $sum: 1
            }

          }
        },

        {
          $sort: {
            value: -1
          }
        }

      ]);


    const coursesByCategory =
      coursesByCategoryRaw.map(
        (item) => ({

          label:
            item._id,

          value:
            item.value

        })
      );


    // ======================================
    // RECENT USERS
    // ======================================

    const recentUsers =
      await User.find()
        .select(
          "name email role createdAt profileImage avatar image"
        )
        .sort({
          createdAt: -1
        })
        .limit(5);


    // ======================================
    // RECENT COURSES
    // ======================================

    const recentCourses =
      await Course.find()
        .populate(
          "instructor",
          "name email"
        )
        .select(
          "title category instructor published createdAt"
        )
        .sort({
          createdAt: -1
        })
        .limit(5);


    // ======================================
    // RECENT ENROLLMENTS
    // ======================================

    const recentEnrollments =
      await Enrollment.find()
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title"
        )
        .sort({
          createdAt: -1
        })
        .limit(5);


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      totalUsers,

      totalStudents,

      totalInstructors,

      totalCourses,

      totalEnrollments,

      usersOverview,

      coursesByCategory,

      recentUsers,

      recentCourses,

      recentEnrollments,
      unreadNotifications,

    });


  } catch (error) {

    console.error(
      "Admin dashboard error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to load admin dashboard",

      error:
        error.message

    });

  }

};


module.exports = {
  getAdminDashboard
};