const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getModuleAssignments,
  getInstructorAssignments,
  getStudentAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} = require("../controllers/assignmentController");
const protect =
  require("../middleware/authMiddleware");

const instructorOnly =
  require("../middleware/roleMiddleware");


// ==========================================
// CREATE ASSIGNMENT
// ==========================================

router.post(
  "/",
  protect,
  instructorOnly,
  createAssignment
);


// ==========================================
// GET MY ASSIGNMENTS - INSTRUCTOR
// ==========================================

router.get(
  "/instructor/my-assignments",
  protect,
  instructorOnly,
  getInstructorAssignments
);


// ==========================================
// GET MY ASSIGNMENTS - STUDENT
// ==========================================

router.get(
  "/my-assignments",
  protect,
  getStudentAssignments
);


// ==========================================
// GET ASSIGNMENTS BY MODULE
// ==========================================

router.get(
  "/module/:moduleId",
  protect,
  getModuleAssignments
);

// ==========================================
// GET ASSIGNMENT BY ID - INSTRUCTOR
// ==========================================

router.get(
  "/:assignmentId",
  protect,
  instructorOnly,
  getAssignmentById
);
// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

router.put(
  "/:assignmentId",
  protect,
  instructorOnly,
  updateAssignment
);


// ==========================================
// DELETE ASSIGNMENT
// ==========================================

router.delete(
  "/:assignmentId",
  protect,
  instructorOnly,
  deleteAssignment
);


module.exports = router;