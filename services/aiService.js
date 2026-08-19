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


module.exports = {
  generateLessonAIResponse
};