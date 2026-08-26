const UserSettings = require("../models/UserSettings");


// =====================================
// GET USER SETTINGS
// =====================================

const getSettings = async (req, res) => {

  try {

    const userId = req.user._id;


    let settings =
      await UserSettings.findOne({
        user: userId
      });


    // =================================
    // CREATE DEFAULT SETTINGS
    // IF NONE EXIST
    // =================================

    if (!settings) {

      settings =
        await UserSettings.create({

          user: userId,

          darkMode: false,

          language: "English",

          notifications: {

            email: true,

            courses: true,

            assignments: true

          }

        });

    }


    return res.status(200).json({

      success: true,

      settings

    });


  } catch (error) {

    console.error(
      "Get settings error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to load settings"

    });

  }

};



// =====================================
// UPDATE USER SETTINGS
// =====================================

const updateSettings = async (req, res) => {

  try {

    const userId = req.user._id;


    const {
      darkMode,
      language,
      notifications
    } = req.body;


    // =================================
    // VALIDATE LANGUAGE
    // =================================

    if (
      language !== undefined &&
      ![
        "English",
        "French"
      ].includes(language)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid language selected"

      });

    }


    // =================================
    // FIND EXISTING SETTINGS
    // =================================

    let settings =
      await UserSettings.findOne({
        user: userId
      });


    // =================================
    // CREATE IF NOT FOUND
    // =================================

    if (!settings) {

      settings =
        new UserSettings({

          user: userId

        });

    }


    // =================================
    // UPDATE APPEARANCE
    // =================================

    if (
      darkMode !== undefined
    ) {

      settings.darkMode =
        Boolean(darkMode);

    }


    // =================================
    // UPDATE LANGUAGE
    // =================================

    if (
      language !== undefined
    ) {

      settings.language =
        language;

    }


    // =================================
    // UPDATE NOTIFICATIONS
    // =================================

    if (
      notifications &&
      typeof notifications === "object"
    ) {


      if (
        notifications.email !== undefined
      ) {

        settings.notifications.email =
          Boolean(
            notifications.email
          );

      }


      if (
        notifications.courses !== undefined
      ) {

        settings.notifications.courses =
          Boolean(
            notifications.courses
          );

      }


      if (
        notifications.assignments !== undefined
      ) {

        settings.notifications.assignments =
          Boolean(
            notifications.assignments
          );

      }

    }


    await settings.save();


    return res.status(200).json({

      success: true,

      message:
        "Settings updated successfully",

      settings

    });


  } catch (error) {

    console.error(
      "Update settings error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update settings"

    });

  }

};



module.exports = {

  getSettings,

  updateSettings

};