const express = require("express");

const router =
  express.Router();

const {
  submitAssignment,
  getMySubmission,
  getAssignmentSubmissions,
  gradeAssignmentSubmission
} =
  require(
    "../controllers/assignmentSubmissionController"
  );

const protect =
  require("../middleware/authMiddleware");

const instructorOnly =
  require("../middleware/roleMiddleware");


// ==========================================
// SUBMIT ASSIGNMENT - STUDENT
// ==========================================

router.post(
  "/:assignmentId/submit",
  protect,
  submitAssignment
);


// ==========================================
// GET MY SUBMISSION - STUDENT
// ==========================================

router.get(
  "/:assignmentId/my-submission",
  protect,
  getMySubmission
);


// ==========================================
// GET ALL SUBMISSIONS - INSTRUCTOR
// ==========================================

router.get(
  "/:assignmentId/submissions",
  protect,
  instructorOnly,
  getAssignmentSubmissions
);


// ==========================================
// GRADE SUBMISSION - INSTRUCTOR
// ==========================================

router.put(
  "/:submissionId/grade",
  protect,
  instructorOnly,
  gradeAssignmentSubmission
);


module.exports = router;