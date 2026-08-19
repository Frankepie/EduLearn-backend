const express = require("express");

const router = express.Router();

const {
  getDiscussions,
  createDiscussion,
  getCourseDiscussions,
  getDiscussionById,
  addReply,
  deleteDiscussion
} = require("../controllers/discussionController");

const protect =
  require("../middleware/authMiddleware");


  // ==========================================
// GET ALL DISCUSSIONS
// ==========================================

router.get(
  "/",
  protect,
  getDiscussions
);
// ==========================================
// CREATE DISCUSSION
// ==========================================

router.post(
  "/",
  protect,
  createDiscussion
);


// ==========================================
// GET DISCUSSIONS FOR A COURSE
// ==========================================

router.get(
  "/course/:courseId",
  protect,
  getCourseDiscussions
);


// ==========================================
// GET ONE DISCUSSION
// ==========================================

router.get(
  "/:id",
  protect,
  getDiscussionById
);


// ==========================================
// ADD REPLY
// ==========================================

router.post(
  "/:id/replies",
  protect,
  addReply
);


// ==========================================
// DELETE DISCUSSION
// ==========================================

router.delete(
  "/:id",
  protect,
  deleteDiscussion
);


module.exports = router;