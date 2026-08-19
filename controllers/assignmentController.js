const Assignment =
  require("../models/Assignment");

const Module =
  require("../models/Module");


// ==========================================
// CREATE ASSIGNMENT
// ==========================================

const createAssignment =
  async (req, res) => {

    try {

      const {
        title,
        description,
        instructions,
        module,
        course,
        dueDate,
        totalMarks,
        published
      } = req.body;


      // ======================================
      // CHECK REQUIRED FIELDS
      // ======================================

      if (!title || !module || !course) {

        return res.status(400).json({

          message:
            "Title, module and course are required"

        });

      }


      // ======================================
      // CHECK MODULE
      // ======================================

      const existingModule =
        await Module.findById(module);

      if (!existingModule) {

        return res.status(404).json({

          message:
            "Module not found"

        });

      }


      // ======================================
      // MAKE SURE MODULE BELONGS TO COURSE
      // ======================================

      if (
        existingModule.course.toString() !==
        course.toString()
      ) {

        return res.status(400).json({

          message:
            "Module does not belong to this course"

        });

      }


      // ======================================
      // CREATE ASSIGNMENT
      // ======================================

      const assignment =
        await Assignment.create({

          title,

          description,

          instructions,

          module,

          course,

          instructor:
            req.user._id,

          dueDate:
            dueDate || null,

          totalMarks:
            totalMarks || 100,

          published:
            published || false

        });


      return res.status(201).json({

        message:
          "Assignment created successfully",

        assignment

      });

    } catch (error) {

      console.error(
        "Error creating assignment:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to create assignment",

        error:
          error.message

      });

    }

  };


// ==========================================
// GET ASSIGNMENTS BY MODULE
// ==========================================

const getModuleAssignments =
  async (req, res) => {

    try {

      const {
        moduleId
      } = req.params;


      const assignments =
        await Assignment.find({

          module:
            moduleId

        })
        .populate(
          "module",
          "title"
        )
        .populate(
          "course",
          "title"
        )
        .sort({
          createdAt: -1
        });


      return res.status(200).json({

        assignments

      });

    } catch (error) {

      console.error(
        "Error loading assignments:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to load assignments",

        error:
          error.message

      });

    }

  };


// ==========================================
// GET MY ASSIGNMENTS
// ==========================================

const getInstructorAssignments =
  async (req, res) => {

    try {

      const assignments =
        await Assignment.find({

          instructor:
            req.user._id

        })
        .populate(
          "module",
          "title"
        )
        .populate(
          "course",
          "title"
        )
        .sort({
          createdAt: -1
        });


      return res.status(200).json({

        assignments

      });

    } catch (error) {

      console.error(
        "Error loading instructor assignments:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to load assignments",

        error:
          error.message

      });

    }

  };


// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

const updateAssignment =
  async (req, res) => {

    try {

      const {
        assignmentId
      } = req.params;


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
      // CHECK OWNERSHIP
      // ======================================

      if (
        assignment.instructor.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({

          message:
            "You are not allowed to update this assignment"

        });

      }


      const {
        title,
        description,
        instructions,
        dueDate,
        totalMarks,
        published
      } = req.body;


      assignment.title =
        title ?? assignment.title;

      assignment.description =
        description ??
        assignment.description;

      assignment.instructions =
        instructions ??
        assignment.instructions;

      assignment.dueDate =
        dueDate ?? assignment.dueDate;

      assignment.totalMarks =
        totalMarks ?? assignment.totalMarks;

      assignment.published =
        published ?? assignment.published;


      await assignment.save();


      return res.status(200).json({

        message:
          "Assignment updated successfully",

        assignment

      });

    } catch (error) {

      console.error(
        "Error updating assignment:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to update assignment",

        error:
          error.message

      });

    }

  };


// ==========================================
// DELETE ASSIGNMENT
// ==========================================

const deleteAssignment =
  async (req, res) => {

    try {

      const {
        assignmentId
      } = req.params;


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
      // CHECK OWNERSHIP
      // ======================================

      if (
        assignment.instructor.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({

          message:
            "You are not allowed to delete this assignment"

        });

      }


      await Assignment.findByIdAndDelete(
        assignmentId
      );


      return res.status(200).json({

        message:
          "Assignment deleted successfully"

      });

    } catch (error) {

      console.error(
        "Error deleting assignment:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to delete assignment",

        error:
          error.message

      });

    }

  };
// ==========================================
// GET MY STUDENT ASSIGNMENTS
// ==========================================

const getMyAssignments =
  async (req, res) => {

    try {

      // Get assignments that are published
      const assignments =
        await Assignment.find({

          published: true

        })
        .populate(
          "module",
          "title"
        )
        .populate(
          "course",
          "title"
        )
        .sort({
          createdAt: -1
        });


      return res.status(200).json({

        assignments

      });

    } catch (error) {

      console.error(
        "Error loading student assignments:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to load student assignments",

        error:
          error.message

      });

    }

  };
  // ==========================================
// GET ALL STUDENT ASSIGNMENTS
// ==========================================

const getStudentAssignments =
  async (req, res) => {

    try {

      const assignments =
        await Assignment.find({
          published: true
        })
        .populate(
          "module",
          "title"
        )
        .populate(
          "course",
          "title"
        )
        .sort({
          createdAt: -1
        });


      return res.status(200).json({

        assignments

      });

    } catch (error) {

      console.error(
        "Error loading student assignments:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to load student assignments",

        error:
          error.message

      });

    }

  };

  // ==========================================
// GET ASSIGNMENT BY ID
// ==========================================

const getAssignmentById =
  async (req, res) => {

    try {

      const {
        assignmentId
      } = req.params;

      const assignment =
        await Assignment.findById(
          assignmentId
        )
        .populate(
          "module",
          "title"
        )
        .populate(
          "course",
          "title"
        );

      if (!assignment) {

        return res.status(404).json({

          message:
            "Assignment not found"

        });

      }

      // Instructor can only access
      // their own assignment

      if (
        assignment.instructor.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({

          message:
            "You are not allowed to view this assignment"

        });

      }

      return res.status(200).json({

        assignment

      });

    } catch (error) {

      console.error(
        "Error loading assignment:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to load assignment",

        error:
          error.message

      });

    }

  };

module.exports = {

  createAssignment,

  getModuleAssignments,

  getInstructorAssignments,

  getStudentAssignments,

  getAssignmentById,

  updateAssignment,

  deleteAssignment

};