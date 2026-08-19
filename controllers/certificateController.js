const Certificate =
  require("../models/Certificate");

const Course =
  require("../models/Course");

const Lesson =
  require("../models/Lesson");

const LessonProgress =
  require("../models/LessonProgress");


const createCertificate =
  async (req, res) => {

    try {

      const studentId =
        req.user._id;

      const { courseId } =
        req.params;


      // ==========================================
      // CHECK COURSE
      // ==========================================

      const course =
        await Course.findById(courseId);

      if (!course) {

        return res.status(404).json({

          message:
            "Course not found"

        });

      }


      // ==========================================
      // GET ALL LESSONS IN THE COURSE
      // ==========================================

      const lessons =
        await Lesson.find({})
          .populate({
            path: "module",
            match: {
              course: courseId
            },
            select: "course"
          });


      const courseLessons =
        lessons.filter(
          lesson =>
            lesson.module !== null
        );


      // ==========================================
      // CHECK COURSE HAS LESSONS
      // ==========================================

      if (courseLessons.length === 0) {

        return res.status(400).json({

          message:
            "This course has no lessons yet"

        });

      }


      // ==========================================
      // GET STUDENT PROGRESS
      // ==========================================

      const lessonIds =
        courseLessons.map(
          lesson => lesson._id
        );


      const progressRecords =
        await LessonProgress.find({

          student: studentId,

          lesson: {
            $in: lessonIds
          }

        });


      // ==========================================
      // COUNT COMPLETED LESSONS
      // ==========================================

      const completedLessons =
        progressRecords.filter(
          progress =>
            progress.completed === true
        ).length;


      const totalLessons =
        courseLessons.length;


      const percentage =
        Math.round(

          (
            completedLessons /
            totalLessons
          ) * 100

        );


      // ==========================================
      // COURSE NOT COMPLETED
      // ==========================================

      if (percentage < 100) {

        return res.status(400).json({

          message:
            "Course is not completed yet",

          progress:
            percentage,

          completedLessons,

          totalLessons

        });

      }


      // ==========================================
      // CHECK EXISTING CERTIFICATE
      // ==========================================

      const existingCertificate =
        await Certificate.findOne({

          student: studentId,

          course: courseId

        });


      if (existingCertificate) {

        return res.status(200).json({

          message:
            "Certificate already exists",

          certificate:
            existingCertificate

        });

      }


      // ==========================================
      // GENERATE CERTIFICATE ID
      // ==========================================

      const certificateId =
        `EDU-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}`;


      // ==========================================
      // CREATE CERTIFICATE
      // ==========================================

      const certificate =
        await Certificate.create({

          certificateId,

          student: studentId,

          course: courseId

        });


      return res.status(201).json({

        message:
          "Certificate created successfully",

        certificate

      });


    } catch (error) {

      console.error(
        "Error creating certificate:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to create certificate",

        error:
          error.message

      });

    }

  };


// ==========================================
// GET MY CERTIFICATES
// ==========================================

const getMyCertificates =
  async (req, res) => {

    try {

      const certificates =
        await Certificate.find({

          student: req.user._id

        })
        .populate(
          "course",
          "title description instructor"
        )
        .sort({
          issuedAt: -1
        });


      return res.status(200).json({

        certificates

      });


    } catch (error) {

      console.error(
        "Error loading certificates:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to load certificates",

        error:
          error.message

      });

    }

  };


// ==========================================
// GET ONE CERTIFICATE
// ==========================================

const getCertificate =
  async (req, res) => {

    try {

      const { certificateId } =
        req.params;


      const certificate =
        await Certificate.findOne({

          certificateId

        })
        .populate(
          "student",
          "fullName email"
        )
        .populate(
          "course",
          "title description instructor"
        );


      if (!certificate) {

        return res.status(404).json({

          message:
            "Certificate not found"

        });

      }


      return res.status(200).json({

        certificate

      });


    } catch (error) {

      console.error(
        "Error loading certificate:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to load certificate",

        error:
          error.message

      });

    }

  };
// ==========================================
// VERIFY CERTIFICATE
// ==========================================

const verifyCertificate = async (req, res) => {

  try {

    const { certificateId } = req.params;

    const certificate =
      await Certificate.findOne({
        certificateId: certificateId
      })
      .populate(
        "student",
        "fullName email"
      )
      .populate(
        "course",
        "title"
      );


    // Certificate does not exist
    if (!certificate) {

      return res.status(404).json({

        valid: false,

        message:
          "Certificate not found"

      });

    }


    // Certificate found
    return res.status(200).json({

      valid: true,

      message:
        "Certificate is valid",

      certificate

    });


  } catch (error) {

    console.error(
      "Certificate verification error:",
      error
    );


    return res.status(500).json({

      valid: false,

      message:
        "Failed to verify certificate",

      error:
        error.message

    });

  }

};

module.exports = {
  createCertificate,
  getMyCertificates,
  getCertificate,
  verifyCertificate
};