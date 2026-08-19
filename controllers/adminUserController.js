const User = require("../models/User");


// =====================================
// GET ALL USERS
// =====================================

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {

    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });

  }
};


// =====================================
// GET SINGLE USER
// =====================================

const getUserById = async (req, res) => {
  try {

    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found."
      });

    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user."
    });

  }
};


// =====================================
// UPDATE USER ROLE
// =====================================

const updateUserRole = async (req, res) => {
  try {

    const {
      role
    } = req.body;


    const allowedRoles = [
      "student",
      "instructor",
      "admin"
    ];


    if (!allowedRoles.includes(role)) {

      return res.status(400).json({
        success: false,
        message: "Invalid role."
      });

    }


    // Prevent admin from changing their own role

    if (
      req.params.id.toString() ===
      req.user._id.toString()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role."
      });

    }


    const user = await User.findById(
      req.params.id
    );


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found."
      });

    }


    user.role = role;

    await user.save();


    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");


    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: updatedUser
    });

  } catch (error) {

    console.error(
      "Update user role error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update user role."
    });

  }
};


// =====================================
// DELETE USER
// =====================================

const deleteUser = async (req, res) => {
  try {

    // Prevent admin from deleting themselves

    if (
      req.params.id.toString() ===
      req.user._id.toString()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account."
      });

    }


    const user = await User.findById(
      req.params.id
    );


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found."
      });

    }


    await User.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({
      success: true,
      message: "User deleted successfully."
    });

  } catch (error) {

    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete user."
    });

  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};