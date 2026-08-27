const OpenAI = require("openai");

// =====================================
// GEMINI CLIENT
// =====================================

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,

  baseURL:
    "https://generativelanguage.googleapis.com/v1beta/openai/"
});


// =====================================
// GENERATE GENERAL AI RESPONSE
// =====================================

const generateAIResponse = async (
  message,
  conversationHistory = [],
  studentContext = {},
  learningContext = null
) => {

  try {

    console.log("General AI request received");


    // =====================================
    // BUILD LEARNING CONTEXT
    // =====================================

    let contextText = "No specific learning context is currently selected.";


    if (learningContext) {

      contextText = `

COURSE:
Title: ${
  learningContext.course?.title ||
  "Unknown"
}

Category: ${
  learningContext.course?.category ||
  "Unknown"
}

Level: ${
  learningContext.course?.level ||
  "Unknown"
}

Description: ${
  learningContext.course?.description ||
  "No description available"
}


MODULE:
Title: ${
  learningContext.module?.title ||
  "Unknown"
}

Description: ${
  learningContext.module?.description ||
  "No description available"
}


LESSON:
Title: ${
  learningContext.lesson?.title ||
  "No specific lesson selected"
}

Content:
${
  learningContext.lesson?.content ||
  "No lesson content available"
}

Duration:
${
  learningContext.lesson?.duration ||
  0
} minutes

`;
    }


    // =====================================
    // STUDENT INFORMATION
    // =====================================

    const studentName =
      studentContext?.name ||
      "Student";

    const studentRole =
      studentContext?.role ||
      "student";


    // =====================================
    // SYSTEM INSTRUCTIONS
    // =====================================

    const systemMessage = `

You are EduLearn AI Assistant.

You are a friendly educational AI assistant
inside the EduLearn Learning Management System.

Your job is to help students understand:

- Courses
- Lessons
- Modules
- Assignments
- Learning concepts
- Study techniques
- General educational questions

You are currently helping:

Student:
${studentName}

Role:
${studentRole}


IMPORTANT RULES:

1. Give clear, accurate and student-friendly
   explanations.

2. When specific course, module or lesson
   context is provided, use it to make your
   answer more relevant.

3. Do not pretend that information belongs to
   the student's course when it is not provided.

4. You may answer general educational questions
   even when no course or lesson is selected.

5. If the student asks about a specific lesson
   and lesson content is available, prioritize
   the provided lesson content.

6. Explain difficult concepts step by step
   when appropriate.

7. Use simple language unless the student
   clearly requests a more advanced explanation.

8. Help students learn rather than simply doing
   graded work for them.

9. Do not invent course or lesson information.

10. Keep responses reasonably concise and useful.

CURRENT LEARNING CONTEXT:

${contextText}

`;


    // =====================================
    // BUILD CONVERSATION
    // =====================================

    const messages = [

      {
        role: "system",
        content: systemMessage
      }

    ];


    // =====================================
    // ADD PREVIOUS CONVERSATION
    // =====================================

    if (Array.isArray(conversationHistory)) {

      conversationHistory.forEach(
        (messageItem) => {

          if (
            messageItem?.role === "user" ||
            messageItem?.role === "assistant"
          ) {

            messages.push({

              role:
                messageItem.role,

              content:
                String(
                  messageItem.content || ""
                )

            });

          }

        }
      );

    }


    // =====================================
    // ADD CURRENT MESSAGE
    // =====================================

    messages.push({

      role: "user",

      content: message

    });


    // =====================================
    // SEND TO GEMINI
    // =====================================

    const response =
      await client.chat.completions.create({

        model: "gemini-3.6-flash",

        messages

      });


    // =====================================
    // GET RESPONSE
    // =====================================

    const answer =
      response
        .choices?.[0]
        ?.message
        ?.content;


    if (!answer) {

      throw new Error(
        "Gemini returned an empty response."
      );

    }


    console.log(
      "General AI response received"
    );


    return answer;

  } catch (error) {

    console.error(
      "GENERAL AI ERROR:",
      error
    );

    throw error;

  }

};


// =====================================
// GENERATE LESSON AI RESPONSE
// =====================================

const generateLessonAIResponse = async ({
  message,
  lesson,
  module,
  course
}) => {

  try {

    console.log("Lesson AI request received");


    const lessonContext = `
COURSE:
Title: ${course?.title || "Unknown"}
Category: ${course?.category || "Unknown"}
Level: ${course?.level || "Unknown"}
Description: ${course?.description || "No description available"}

MODULE:
Title: ${module?.title || "Unknown"}
Description: ${module?.description || "No description available"}

LESSON:
Title: ${lesson?.title || "Unknown"}
Content:
${lesson?.content || "No lesson content available"}

Video:
${lesson?.videoUrl || "No video available"}

Duration:
${lesson?.duration || 0} minutes
`;


    const response =
      await client.chat.completions.create({

        model: "gemini-3.6-flash",

        messages: [

          {
            role: "system",

            content: `
You are EduLearn Lesson AI.

You are an AI learning assistant
embedded inside a specific lesson.

Your job is to help the student understand
ONLY the lesson, module, and course context
provided to you.

IMPORTANT RULES:

1. Use the provided course, module and lesson
   information as your primary and only source.

2. Do not invent information that is not present
   in the provided context.

3. If the student's question cannot be answered
   from the provided context, clearly say:

"I can only answer questions related to
this lesson and its course context."

4. You may explain, simplify, summarize,
   clarify, or give examples of concepts that
   are contained in the lesson context.

5. Do not pretend that information outside the
   provided context belongs to this lesson.

6. If the student asks for help understanding
   something from the lesson, explain it step
   by step in simple educational language.

7. Do not simply complete graded work dishonestly.
   Guide the student toward understanding.

8. Keep responses reasonably concise and
   student-friendly.

CURRENT LESSON CONTEXT:

${lessonContext}
`
          },

          {
            role: "user",

            content: message

          }

        ]

      });


    const answer =
      response
        .choices?.[0]
        ?.message
        ?.content;


    if (!answer) {

      throw new Error(
        "Gemini returned an empty response."
      );

    }


    console.log(
      "Lesson AI response received"
    );


    return answer;

  } catch (error) {

    console.error(
      "LESSON AI ERROR:",
      error
    );

    throw error;

  }

};


// =====================================
// EXPORT
// =====================================

module.exports = {

  generateAIResponse,

  generateLessonAIResponse

};