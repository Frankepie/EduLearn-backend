const {
  generateAIResponse,
  generateLessonAIResponse
} = require("../services/aiService");
const Lesson =
  require("../models/Lesson");

const Module =
  require("../models/Module");

const Course =
  require("../models/Course");
// =====================================
// CHAT WITH AI
// =====================================

const chatWithAI = async (req, res) => {

  try {

    const {
  message,
  conversationHistory = [],
  learningContext = null
} = req.body;


    // =================================
    // VALIDATE MESSAGE
    // =================================

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {

      return res.status(400).json({
        success: false,
        message: "Please provide a message."
      });

    }


    // =================================
    // VALIDATE CONVERSATION HISTORY
    // =================================

    if (
      !Array.isArray(conversationHistory)
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Conversation history must be an array."
      });

    }


    // =================================
    // STUDENT CONTEXT
    // =================================

    const studentContext = {

      role:
        req.user?.role || "student",

      name:
        req.user?.name || "Student"

    };


    // =================================
    // GENERATE AI RESPONSE
    // =================================

    const answer =
      await generateAIResponse(
  message.trim(),
  conversationHistory,
  studentContext,
  learningContext
);


    // =================================
    // SEND RESPONSE
    // =================================

    res.status(200).json({

      success: true,

      answer

    });


  } catch (error) {

    console.error(
      "AI assistant error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to process your AI request."

    });

  }

};
// =====================================
// LESSON AI ASSISTANT
// =====================================

const chatWithLessonAI =
  async (req, res) => {

    try {

      const {
        message,
        lessonId
      } = req.body;


      // ---------------------------------
      // VALIDATE MESSAGE
      // ---------------------------------

      if (
        !message ||
        typeof message !== "string" ||
        !message.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please provide a message."

        });

      }


      // ---------------------------------
      // VALIDATE LESSON
      // ---------------------------------

      if (!lessonId) {

        return res.status(400).json({

          success: false,

          message:
            "Lesson ID is required."

        });

      }


      // ---------------------------------
      // GET LESSON
      // ---------------------------------

      const lesson =
        await Lesson.findById(
          lessonId
        );


      if (!lesson) {

        return res.status(404).json({

          success: false,

          message:
            "Lesson not found."

        });

      }


      // ---------------------------------
      // GET MODULE
      // ---------------------------------

      const module =
        await Module.findById(
          lesson.module
        );


      if (!module) {

        return res.status(404).json({

          success: false,

          message:
            "Module not found."

        });

      }


      // ---------------------------------
      // GET COURSE
      // ---------------------------------

      const course =
        await Course.findById(
          module.course
        );


      if (!course) {

        return res.status(404).json({

          success: false,

          message:
            "Course not found."

        });

      }


      // ---------------------------------
      // GENERATE AI RESPONSE
      // ---------------------------------

      const answer =
        await generateLessonAIResponse({

          message:
            message.trim(),

          lesson,

          module,

          course

        });


      // ---------------------------------
      // RESPONSE
      // ---------------------------------

      res.status(200).json({

        success: true,

        answer,

        context: {

          lessonId:
            lesson._id,

          lessonTitle:
            lesson.title,

          moduleTitle:
            module.title,

          courseTitle:
            course.title

        }

      });

    } catch (error) {

      console.error(
        "Lesson AI assistant error:",
        error
      );


      res.status(500).json({

        success: false,

        message:
          "Unable to process your lesson AI request."

      });

    }

  };
// =====================================
// EXPORT
// =====================================

module.exports = {
  chatWithAI,
  chatWithLessonAI
};