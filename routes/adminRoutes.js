const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getAdminDashboard,
  getAdminUsers,
  getAdminCourses,
  getAdminEnrollments,
  getAdminCertificates
} = require("../controllers/adminController");


// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

const adminOnly = (req, res, next) => {

  if (
    !req.user ||
    req.user.role?.toLowerCase() !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Admin access required."
    });
  }

  next();
};


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);


// ==========================================
// ADMIN COURSES
// ==========================================

router.get(
  "/courses",
  protect,
  adminOnly,
  getAdminCourses
);


// ==========================================
// ADMIN ENROLLMENTS
// ==========================================

router.get(
  "/enrollments",
  protect,
  adminOnly,
  getAdminEnrollments
);

// ==========================================
// ADMIN USERS
// ==========================================

router.get(
  "/users",
  protect,
  adminOnly,
  getAdminUsers
);
// ==========================================
// ADMIN CERTIFICATES
// ==========================================

router.get(
  "/certificates",
  protect,
  adminOnly,
  getAdminCertificates
);


module.exports = router;