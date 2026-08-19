const Module =
  require("../models/Module");

const Course =
  require("../models/Course");


/*
  CREATE MODULE
*/
const createModule =
  async (req, res) => {

    try {

      const {
        title,
        description,
        course,
        order
      } = req.body;


      if (!title || !course) {

        return res.status(400).json({
          message:
            "Title and course are required"
        });

      }


      const existingCourse =
        await Course.findById(course);


      if (!existingCourse) {

        return res.status(404).json({
          message:
            "Course not found"
        });

      }


      if (
        existingCourse.instructor.toString() !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "You can only add modules to your own courses"
        });

      }


      const newModule =
        await Module.create({

          title,

          description,

          course,

          order:
            order || 0

        });


      res.status(201).json({

        message:
          "Module created successfully",

        module:
          newModule

      });

    } catch (error) {

      console.error(
        "Create module error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });

    }

  };


/*
  GET MODULES FOR A COURSE
*/
const getCourseModules =
  async (req, res) => {

    try {

      const modules =
        await Module.find({
          course: req.params.courseId
        })
        .sort({
          order: 1,
          createdAt: 1
        });


      res.status(200).json({

        modules

      });

    } catch (error) {

      console.error(
        "Get modules error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });

    }

  };


/*
  UPDATE MODULE
*/
const updateModule =
  async (req, res) => {

    try {

      const module =
        await Module.findById(
          req.params.id
        );


      if (!module) {

        return res.status(404).json({
          message:
            "Module not found"
        });

      }


      const course =
        await Course.findById(
          module.course
        );


      if (!course) {

        return res.status(404).json({
          message:
            "Course not found"
        });

      }


      if (
        course.instructor.toString() !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "You can only edit your own modules"
        });

      }


      const updatedModule =
        await Module.findByIdAndUpdate(

          req.params.id,

          {
            title:
              req.body.title,

            description:
              req.body.description,

            order:
              req.body.order
          },

          {
            new: true,
            runValidators: true
          }

        );


      res.status(200).json({

        message:
          "Module updated successfully",

        module:
          updatedModule

      });

    } catch (error) {

      console.error(
        "Update module error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });

    }

  };


/*
  DELETE MODULE
*/
const deleteModule =
  async (req, res) => {

    try {

      const module =
        await Module.findById(
          req.params.id
        );


      if (!module) {

        return res.status(404).json({
          message:
            "Module not found"
        });

      }


      const course =
        await Course.findById(
          module.course
        );


      if (!course) {

        return res.status(404).json({
          message:
            "Course not found"
        });

      }


      if (
        course.instructor.toString() !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "You can only delete your own modules"
        });

      }


      await Module.findByIdAndDelete(
        req.params.id
      );


      res.status(200).json({

        message:
          "Module deleted successfully"

      });

    } catch (error) {

      console.error(
        "Delete module error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });

    }

  };


module.exports = {

  createModule,

  getCourseModules,

  updateModule,

  deleteModule

};