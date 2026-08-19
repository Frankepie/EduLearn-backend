const Lesson =
  require("../models/Lesson");

const Module =
  require("../models/Module");


// CREATE LESSON

const createLesson =
  async (req, res) => {

    try {

      const {
        title,
        content,
        videoUrl,
        duration,
        order,
        module
      } = req.body;


      if (!title) {

        return res.status(400).json({
          message:
            "Lesson title is required"
        });

      }


      if (!module) {

        return res.status(400).json({
          message:
            "Module is required"
        });

      }


      const moduleExists =
        await Module.findById(
          module
        );


      if (!moduleExists) {

        return res.status(404).json({
          message:
            "Module not found"
        });

      }


      const lesson =
        await Lesson.create({

          title,

          content,

          videoUrl,

          duration,

          order,

          module

        });


      res.status(201).json({

        message:
          "Lesson created successfully",

        lesson

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Failed to create lesson",

        error:
          error.message

      });

    }

  };

// GET LESSONS BY MODULE

const getModuleLessons =
  async (req, res) => {

    try {

      const {
        moduleId
      } = req.params;


      const module =
        await Module.findById(
          moduleId
        ).populate("course");


      if (!module) {

        return res.status(404).json({

          message:
            "Module not found"

        });

      }


      const lessons =
        await Lesson.find({
          module: moduleId
        })
        .sort({
          order: 1
        });


      const lessonsWithCourse =
        lessons.map(
          (lesson) => ({

            ...lesson.toObject(),

            course:
              module.course?._id ||
              module.course

          })
        );

// course + module context for edulearn ai
     res.json({

  lessons: lessonsWithCourse,

  module: {
    _id: module._id,
    title: module.title,
    description: module.description,
    order: module.order
  },

  course: module.course
    ? {
        _id: module.course._id,
        title: module.course.title,
        description: module.course.description,
        category: module.course.category,
        level: module.course.level,
        duration: module.course.duration
      }
    : null

});

    } catch (error) {

      res.status(500).json({

        message:
          "Failed to get lessons",

        error:
          error.message

      });

    }

  };


// UPDATE LESSON

const updateLesson =
  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const lesson =
        await Lesson.findById(
          id
        );


      if (!lesson) {

        return res.status(404).json({

          message:
            "Lesson not found"

        });

      }


      lesson.title =
        req.body.title ??
        lesson.title;

      lesson.content =
        req.body.content ??
        lesson.content;

      lesson.videoUrl =
        req.body.videoUrl ??
        lesson.videoUrl;

      lesson.duration =
        req.body.duration ??
        lesson.duration;

      lesson.order =
        req.body.order ??
        lesson.order;


      await lesson.save();


      res.json({

        message:
          "Lesson updated successfully",

        lesson

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Failed to update lesson",

        error:
          error.message

      });

    }

  };


// DELETE LESSON

const deleteLesson =
  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const lesson =
        await Lesson.findById(
          id
        );


      if (!lesson) {

        return res.status(404).json({

          message:
            "Lesson not found"

        });

      }


      await Lesson.findByIdAndDelete(
        id
      );


      res.json({

        message:
          "Lesson deleted successfully"

      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to delete lesson",
        error:
          error.message
      });
    }
  };
module.exports = {
  createLesson,
  getModuleLessons,
  updateLesson,
  deleteLesson
};