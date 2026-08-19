const Discussion = require("../models/Discussion");
// ==========================================
// GET ALL DISCUSSIONS
// ==========================================

const getDiscussions = async (req, res) => {

  try {

    const discussions =
      await Discussion.find()
        .populate(
          "author",
          "name email role"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json({

      discussions

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to load discussions",

      error:
        error.message

    });

  }

};

// ==========================================
// CREATE DISCUSSION
// ==========================================

const createDiscussion = async (req, res) => {
  try {

    const { title, content, course } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const discussion = await Discussion.create({
      title,
      content,
      course,
      author: req.user._id
    });

    const populatedDiscussion =
      await Discussion.findById(discussion._id)
        .populate("author", "name email role");

    res.status(201).json({
      message: "Discussion created successfully",
      discussion: populatedDiscussion
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create discussion",
      error: error.message
    });

  }
};


// ==========================================
// GET DISCUSSIONS FOR COURSE
// ==========================================

const getCourseDiscussions = async (req, res) => {
  try {

    const { courseId } = req.params;

    const discussions =
      await Discussion.find({
        course: courseId
      })
        .populate("author", "name email role")
        .sort({ createdAt: -1 });

    res.status(200).json({
      discussions
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to load discussions",
      error: error.message
    });

  }
};


// ==========================================
// GET ONE DISCUSSION
// ==========================================

const getDiscussionById = async (req, res) => {
  try {

    const { id } = req.params;

    const discussion =
      await Discussion.findById(id)
        .populate("author", "name email role");

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found"
      });
    }

    res.status(200).json({
      discussion
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to load discussion",
      error: error.message
    });

  }
};


// ==========================================
// ADD REPLY
// ==========================================

const addReply = async (req, res) => {
  try {

    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Reply content is required"
      });
    }

    const discussion =
      await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found"
      });
    }

    if (!discussion.replies) {
      discussion.replies = [];
    }

    discussion.replies.push({
      content,
      author: req.user._id
    });

    await discussion.save();

    const updatedDiscussion =
      await Discussion.findById(id)
        .populate("author", "name email role")
        .populate(
          "replies.author",
          "name email role"
        );

    res.status(200).json({
      message: "Reply added successfully",
      discussion: updatedDiscussion
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to add reply",
      error: error.message
    });

  }
};


// ==========================================
// DELETE DISCUSSION
// ==========================================

const deleteDiscussion = async (req, res) => {
  try {

    const { id } = req.params;

    const discussion =
      await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found"
      });
    }

    if (
      discussion.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own discussion"
      });
    }

    await Discussion.findByIdAndDelete(id);

    res.status(200).json({
      message: "Discussion deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete discussion",
      error: error.message
    });

  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getDiscussions,
  createDiscussion,
  getCourseDiscussions,
  getDiscussionById,
  addReply,
  deleteDiscussion
};