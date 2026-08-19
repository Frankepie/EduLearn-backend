const express = require("express");

const router = express.Router();

const {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require("../controllers/notificationController");


// ==========================================
// AUTHENTICATION
// ==========================================

const protect =
  require("../middleware/authMiddleware");


// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

const adminOnly =
  require("../middleware/adminMiddleware");


// ==========================================
// GET ADMIN NOTIFICATIONS
// ==========================================

router.get(
  "/",
  protect,
  adminOnly,
  getAdminNotifications
);


// ==========================================
// MARK ALL AS READ
// ==========================================

router.put(
  "/read-all",
  protect,
  adminOnly,
  markAllNotificationsAsRead
);


// ==========================================
// MARK ONE AS READ
// ==========================================

router.put(
  "/:id/read",
  protect,
  adminOnly,
  markNotificationAsRead
);


module.exports = router;