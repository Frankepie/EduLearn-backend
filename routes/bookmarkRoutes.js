const express = require("express");

const router = express.Router();

const {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  checkBookmark
} = require("../controllers/bookmarkController");

const authMiddleware =
  require("../middleware/authMiddleware");


// ==========================================
// GET MY BOOKMARKS
// ==========================================

router.get(
  "/my-bookmarks",
  authMiddleware,
  getMyBookmarks
);


// ==========================================
// CHECK BOOKMARK
// ==========================================

router.get(
  "/check/:lessonId",
  authMiddleware,
  checkBookmark
);


// ==========================================
// ADD BOOKMARK
// ==========================================

router.post(
  "/:lessonId",
  authMiddleware,
  addBookmark
);


// ==========================================
// REMOVE BOOKMARK
// ==========================================

router.delete(
  "/:lessonId",
  authMiddleware,
  removeBookmark
);


module.exports = router;