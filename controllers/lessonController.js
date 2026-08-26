const Lesson =
  require("../models/Lesson");

const Module =
  require("../models/Module");

const {
  uploadVideoToCloudinary
} =
  require("../utils/uploadToCloudinary");


// =====================================
// CREATE LESSON
// =====================================

const createLesson =
  async (req, res) => {

    try {

      const {
        title,
        content,
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
        await Module.findById(module);


      if (!moduleExists) {

        return res.status(404).json({
          message:
            "Module not found"
        });

      }


      let videoUrl = "";


      /*
       * =================================
       * UPLOAD VIDEO TO CLOUDINARY
       * =================================
       */

      if (req.file) {

        const result =
          await uploadVideoToCloudinary(
            req.file.buffer
          );

        videoUrl =
          result.secure_url;

      }


      const lesson =
        await Lesson.create({

          title,

          content:
            content || "",

          videoUrl,

          duration:
            Number(duration) || 0,

          order:
            Number(order) || 1,

          module

        });


      res.status(201).json({

        message:
          "Lesson created successfully",

        lesson

      });

    } catch (error) {

      console.error(
        "Create lesson error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to create lesson",

        error:
          error.message

      });

    }

  };

// =====================================
// GET LESSONS BY MODULE
// =====================================

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


      // --------------------------------
      // COURSE + MODULE CONTEXT
      // FOR EDULEARN AI
      // --------------------------------

      res.json({

        lessons:
          lessonsWithCourse,

        module: {

          _id:
            module._id,

          title:
            module.title,

          description:
            module.description,

          order:
            module.order

        },

        course:
          module.course

            ? {

                _id:
                  module.course._id,

                title:
                  module.course.title,

                description:
                  module.course.description,

                category:
                  module.course.category,

                level:
                  module.course.level,

                duration:
                  module.course.duration

              }

            : null

      });

    } catch (error) {

      console.error(
        "Get lessons error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get lessons",

        error:
          error.message

      });

    }

  };


// =====================================
// UPDATE LESSON
// =====================================

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


      // -------------------------------
      // UPDATE TEXT FIELDS
      // -------------------------------

      lesson.title =
        req.body.title ??
        lesson.title;


      lesson.content =
        req.body.content ??
        lesson.content;


      lesson.duration =
        req.body.duration ??
        lesson.duration;


      lesson.order =
        req.body.order ??
        lesson.order;


      // -------------------------------
      // REPLACE VIDEO IF NEW FILE
      // PROVIDED
      // -------------------------------

      if (req.file) {

        const result =
          await uploadVideoToCloudinary(
            req.file.buffer
          );

        lesson.videoUrl =
          result.secure_url;

      }


      // -------------------------------
      // SAVE
      // -------------------------------

      await lesson.save();


      res.json({

        message:
          "Lesson updated successfully",

        lesson

      });

    } catch (error) {

      console.error(
        "Update lesson error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update lesson",

        error:
          error.message

      });

    }

  };


// =====================================
// DELETE LESSON
// =====================================

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

      console.error(
        "Delete lesson error:",
        error
      );

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