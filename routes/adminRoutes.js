const express = require("express");

const router =
  express.Router();

const {
  getAdminDashboard
} = require(
  "../controllers/adminController"
);

const protect =
  require(
    "../middleware/authMiddleware"
  );

const adminOnly =
  require(
    "../middleware/adminMiddleware"
  );


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);


module.exports = router;