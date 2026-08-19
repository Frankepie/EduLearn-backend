const AssignmentSubmission =
  require("../models/AssignmentSubmission");

const Assignment =
  require("../models/Assignment");


// ==========================================
// SUBMIT ASSIGNMENT
// ==========================================

const submitAssignment =
  async (req, res) => {

    try {

      const { assignmentId } =
        req.params;

      const { answer } =
        req.body;

      const studentId =
        req.user._id;


      // ======================================
      // CHECK ANSWER
      // ======================================

      if (!answer || !answer.trim()) {

        return res.status(400).json({

          message:
            "Please provide an answer"

        });

      }


      // ======================================
      // CHECK ASSIGNMENT
      // ======================================

      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {

        return res.status(404).json({

          message:
            "Assignment not found"

        });

      }


      // ======================================
      // CHECK PUBLISHED
      // ======================================

      if (!assignment.published) {

        return res.status(400).json({

          message:
            "This assignment is not available yet"

        });

      }


      // ======================================
      // CHECK DUE DATE
      // ======================================

      if (
        assignment.dueDate &&
        new Date() > new Date(
          assignment.dueDate
        )
      ) {

        return res.status(400).json({

          message:
            "The submission deadline has passed"

        });

      }


      // ======================================
      // CHECK EXISTING SUBMISSION
      // ======================================

      const existingSubmission =
        await AssignmentSubmission.findOne({

          assignment: assignmentId,

          student: studentId

        });


      if (existingSubmission) {

        return res.status(400).json({

          message:
            "You have already submitted this assignment",

          submission:
            existingSubmission

        });

      }


      // ======================================
      // CREATE SUBMISSION
      // ======================================

      const submission =
        await AssignmentSubmission.create({

          assignment:
            assignmentId,

          student:
            studentId,

          answer:
            answer.trim(),

          submittedAt:
            new Date(),

          status:
            "Submitted"

        });


      return res.status(201).json({

        message:
          "Assignment submitted successfully",

        submission

      });

    } catch (error) {

      console.error(
        "Error submitting assignment:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to submit assignment",

        error:
          error.message

      });

    }

  };


// ==========================================
// GET MY SUBMISSION
// ==========================================

const getMySubmission =
  async (req, res) => {

    try {

      const { assignmentId } =
        req.params;

      const studentId =
        req.user._id;


      const submission =
        await AssignmentSubmission
          .findOne({

            assignment:
              assignmentId,

            student:
              studentId

          })
          .populate(
            "assignment",
            "title description instructions dueDate totalMarks"
          );


      return res.status(200).json({

        submission:
          submission || null

      });

    } catch (error) {

      console.error(
        "Error loading submission:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to load submission",

        error:
          error.message

      });

    }

  };
// ==========================================
// GET ALL SUBMISSIONS FOR AN ASSIGNMENT
// ==========================================

const getAssignmentSubmissions =
  async (req, res) => {

    try {

      const { assignmentId } =
        req.params;

      // Check assignment
      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {

        return res.status(404).json({

          message:
            "Assignment not found"

        });

      }

      // Make sure instructor owns assignment
      if (
        assignment.instructor.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({

          message:
            "You are not allowed to view these submissions"

        });

      }

      const submissions =
        await AssignmentSubmission
          .find({
            assignment:
              assignmentId
          })
          .populate(
            "student",
            "fullName name email"
          )
          .sort({
            submittedAt: -1
          });

      return res.status(200).json({

        submissions

      });

    } catch (error) {

      console.error(
        "Error loading assignment submissions:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to load assignment submissions",

        error:
          error.message

      });

    }

  };


// ==========================================
// GRADE ASSIGNMENT SUBMISSION
// ==========================================

const gradeAssignmentSubmission =
  async (req, res) => {

    try {

      const { submissionId } =
        req.params;

      const {
        marks,
        feedback
      } = req.body;


      // ======================================
      // CHECK MARKS
      // ======================================

      if (
        marks === undefined ||
        marks === null ||
        marks === ""
      ) {

        return res.status(400).json({

          message:
            "Marks are required"

        });

      }


      // ======================================
      // FIND SUBMISSION
      // ======================================

      const submission =
        await AssignmentSubmission
          .findById(
            submissionId
          )
          .populate(
            "assignment"
          );


      if (!submission) {

        return res.status(404).json({

          message:
            "Submission not found"

        });

      }


      // ======================================
      // CHECK ASSIGNMENT OWNERSHIP
      // ======================================

      if (
        submission.assignment.instructor
          .toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({

          message:
            "You are not allowed to grade this submission"

        });

      }


      // ======================================
      // CHECK MARK RANGE
      // ======================================

      const numericMarks =
        Number(marks);

      if (
        Number.isNaN(numericMarks) ||
        numericMarks < 0
      ) {

        return res.status(400).json({

          message:
            "Marks must be a valid number"

        });

      }


      if (
        numericMarks >
        submission.assignment.totalMarks
      ) {

        return res.status(400).json({

          message:
            `Marks cannot exceed ${submission.assignment.totalMarks}`

        });

      }


      // ======================================
      // SAVE GRADE
      // ======================================

      submission.marks =
        numericMarks;

      submission.feedback =
        feedback || "";

      submission.status =
        "Graded";


      await submission.save();


      return res.status(200).json({

        message:
          "Submission graded successfully",

        submission

      });

    } catch (error) {

      console.error(
        "Error grading submission:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to grade submission",

        error:
          error.message

      });

    }

  };

module.exports = {

  submitAssignment,

  getMySubmission,

  getAssignmentSubmissions,

  gradeAssignmentSubmission

};