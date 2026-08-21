const express = require("express");

const protect =
  require("../middleware/authMiddleware");

const checkCourseCommunicationAccess =
  require(
    "../middleware/communicationMiddleware"
  );

const {
  getCourseCommunication,
  getCourseStudents,
  createConversation
} =
  require(
    "../controllers/communicationController"
  );

const router =
  express.Router();


// ==========================================
// COURSE COMMUNICATION
// ==========================================

router.get(
  "/course/:courseId",

  protect,

  checkCourseCommunicationAccess,

  getCourseCommunication
);


// ==========================================
// COURSE STUDENTS
// ==========================================

router.get(
  "/course/:courseId/students",

  protect,

  checkCourseCommunicationAccess,

  getCourseStudents
);


// ==========================================
// CREATE CONVERSATION
// ==========================================

router.post(
  "/conversation",

  protect,

  checkCourseCommunicationAccess,

  createConversation
);


module.exports =
  router;