const User = require("../models/User");

const {
  uploadProfileImageToCloudinary
} = require("../utils/uploadToCloudinary");


// =====================================
// GET MY PROFILE
// =====================================

const getMyProfile = async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    return res.status(200).json({
      user
    });

  } catch (error) {

    console.error(
      "Get profile error:",
      error
    );

    return res.status(500).json({
      message: "Failed to load profile"
    });

  }

};


// =====================================
// UPDATE MY PROFILE
// =====================================

const updateMyProfile = async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }


    // -------------------------------
    // UPDATE NAME
    // -------------------------------

    if (
      req.body.name !== undefined
    ) {

      const name =
        req.body.name.trim();

      if (!name) {

        return res.status(400).json({
          message:
            "Name cannot be empty"
        });

      }

      user.name = name;

    }


    // -------------------------------
    // UPLOAD PROFILE IMAGE
    // -------------------------------

    if (req.file) {

      const result =
        await uploadProfileImageToCloudinary(
          req.file.buffer
        );

      user.profileImage =
        result.secure_url;

    }


    await user.save();


    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");


    return res.status(200).json({

      message:
        "Profile updated successfully",

      user:
        updatedUser

    });

  } catch (error) {

    console.error(
      "Update profile error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update profile"
    });

  }

};


module.exports = {
  getMyProfile,
  updateMyProfile
};