const express = require("express");

const router =
  express.Router();


const protect =
  require("../middleware/authMiddleware");


const {
  chatWithAI,
  chatWithLessonAI
} =
  require("../controllers/aiController");


// =====================================
// GENERAL AI ASSISTANT
// =====================================

router.post(
  "/chat",
  protect,
  chatWithAI
);


// =====================================
// LESSON AI ASSISTANT
// =====================================

router.post(
  "/lesson-chat",
  protect,
  chatWithLessonAI
);


module.exports =
  router;