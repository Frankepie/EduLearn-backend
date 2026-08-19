const Bookmark = require("../models/Bookmark");

// ==========================================
// ADD BOOKMARK
// ==========================================
const addBookmark = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { course } = req.body;

    if (!course || !lessonId) {
      return res.status(400).json({
        message: "Course and lesson are required",
      });
    }

    const existingBookmark =
      await Bookmark.findOne({
        student: req.user.id,
        lesson: lessonId,
      });

    if (existingBookmark) {
      return res.status(400).json({
        message: "Lesson is already bookmarked",
      });
    }

    const bookmark =
      await Bookmark.create({
        student: req.user.id,
        course,
        lesson: lessonId,
      });

    res.status(201).json({
      message: "Lesson bookmarked successfully",
      bookmark,
    });

  } catch (error) {

    console.error(
      "Add bookmark error:",
      error
    );

    res.status(500).json({
      message: "Failed to add bookmark",
      error: error.message,
    });
  }
};


// ==========================================
// REMOVE BOOKMARK
// ==========================================
const removeBookmark = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      student: req.user.id,
      lesson: lessonId,
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    res.status(200).json({
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error("Remove bookmark error:", error);

    res.status(500).json({
      message: "Failed to remove bookmark",
      error: error.message,
    });
  }
};


// ==========================================
// GET MY BOOKMARKS
// ==========================================
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      student: req.user.id,
    })
      .populate("course", "title")
      .populate("lesson", "title");

    res.status(200).json({
      bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);

    res.status(500).json({
      message: "Failed to get bookmarks",
      error: error.message,
    });
  }
};


// ==========================================
// CHECK BOOKMARK
// ==========================================
const checkBookmark = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const bookmark = await Bookmark.findOne({
      student: req.user.id,
      lesson: lessonId,
    });

    res.status(200).json({
      bookmarked: !!bookmark,
      bookmark,
    });
  } catch (error) {
    console.error("Check bookmark error:", error);

    res.status(500).json({
      message: "Failed to check bookmark",
      error: error.message,
    });
  }
};


module.exports = {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  checkBookmark,
};