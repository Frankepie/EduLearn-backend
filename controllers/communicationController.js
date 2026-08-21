const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

// ==========================================
// GET COURSE COMMUNICATION
// ==========================================

const getCourseCommunication = async (
  req,
  res
) => {

  try {

    const course =
      req.communicationCourse;

    const conversations =
      await Conversation.find({
        course: course._id,
        participants: req.user.id
      })
        .populate(
          "participants",
          "name email profileImage role"
        )
        .populate(
          "lastMessage"
        )
        .sort({
          updatedAt: -1
        });

    res.status(200).json({

      course: {
  _id: course._id,
  title: course.title,

  instructor:
    course.instructor
},

      isForumAdmin:
        req.isForumAdmin,

      conversations

    });

  } catch (error) {

    console.error(
      "Get course communication error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load course communication"
    });

  }

};


// ==========================================
// GET ENROLLED STUDENTS
// ==========================================

const getCourseStudents = async (
  req,
  res
) => {

  try {

    const course =
      req.communicationCourse;

    const enrollments =
      await Enrollment.find({
        course: course._id
      })
        .populate(
          "student",
          "name email profileImage role"
        );

    const students =
      enrollments
        .map(
          enrollment =>
            enrollment.student
        )
        .filter(
          student => student
        );

    res.status(200).json({

      course: {
  _id: course._id,
  title: course.title,

  instructor:
    course.instructor
},

      students

    });

  } catch (error) {

    console.error(
      "Get course students error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load course students"
    });

  }

};


// ==========================================
// CREATE CONVERSATION
// ==========================================

const createConversation = async (
  req,
  res
) => {

  try {

    const {
      courseId,
      participantId
    } = req.body;

    if (
      !courseId ||
      !participantId
    ) {

      return res.status(400).json({
        message:
          "Course ID and participant ID are required"
      });

    }

    const course =
      req.communicationCourse;

    // ======================================
    // GET PARTICIPANT
    // ======================================

    const participant =
      await User.findById(
        participantId
      );

    if (!participant) {

      return res.status(404).json({
        message:
          "Participant not found"
      });

    }

    // ======================================
    // PREVENT SELF CONVERSATION
    // ======================================

    if (
      participantId.toString() ===
      req.user.id.toString()
    ) {

      return res.status(400).json({
        message:
          "You cannot create a conversation with yourself"
      });

    }

    // ======================================
    // DETERMINE PERMISSION
    // ======================================

    const currentUserRole =
      req.user.role?.toLowerCase();

    const participantRole =
      participant.role?.toLowerCase();

    // ======================================
    // STUDENT
    // ======================================

    if (
      currentUserRole ===
      "student"
    ) {

      // Student can only communicate
      // with the instructor of this course.

      if (
        participantRole !==
        "instructor"
      ) {

        return res.status(403).json({
          message:
            "Students can only communicate with the course instructor"
        });

      }

      if (
        course.instructor.toString() !==
        participantId.toString()
      ) {

        return res.status(403).json({
          message:
            "You can only communicate with the instructor of this course"
        });

      }

    }

    // ======================================
    // INSTRUCTOR
    // ======================================

    if (
      currentUserRole ===
      "instructor"
    ) {

      // Instructor can only communicate
      // with students enrolled in this course.

      if (
        participantRole !==
        "student"
      ) {

        return res.status(403).json({
          message:
            "Instructors can only communicate with enrolled students"
        });

      }

      const enrollment =
        await Enrollment.findOne({
          course: course._id,
          student: participantId
        });

      if (!enrollment) {

        return res.status(403).json({
          message:
            "This student is not enrolled in your course"
        });

      }

    }

    // ======================================
    // ADMIN
    // ======================================

    // Global admins are allowed to access
    // communication for administration.

    // ======================================
    // FIND EXISTING CONVERSATION
    // ======================================

    let conversation =
      await Conversation.findOne({
        course: course._id,

        participants: {
          $all: [
            req.user.id,
            participantId
          ]
        }
      });

    // ======================================
    // CREATE IF NOT FOUND
    // ======================================

    if (!conversation) {

      conversation =
        await Conversation.create({

          course:
            course._id,

          participants: [
            req.user.id,
            participantId
          ]

        });

    }

    // ======================================
    // POPULATE
    // ======================================

    conversation =
      await Conversation.findById(
        conversation._id
      )
        .populate(
          "participants",
          "name email profileImage role"
        )
        .populate(
          "lastMessage"
        );

    res.status(201).json({

      message:
        "Conversation ready",

      conversation

    });

  } catch (error) {

    console.error(
      "Create conversation error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create conversation"
    });

  }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  getCourseCommunication,

  getCourseStudents,

  createConversation

};