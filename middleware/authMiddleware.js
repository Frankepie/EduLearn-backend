const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Admin = require("../models/Admin");


const protect = async (req, res, next) => {

  try {

    let token;


    // =================================
    // CHECK AUTHORIZATION HEADER
    // =================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token =
        req.headers.authorization.split(" ")[1];

    }


    // =================================
    // NO TOKEN
    // =================================

    if (!token) {

      return res.status(401).json({

        message:
          "Not authorized. Please login."

      });

    }


    // =================================
    // VERIFY TOKEN
    // =================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // =================================
    // ADMIN
    // =================================

    if (decoded.role === "admin") {

      const admin =
        await Admin.findById(
          decoded.id
        ).select("-password");


      if (!admin) {

        return res.status(401).json({

          message:
            "Admin not found."

        });

      }


      // Attach admin to request
      req.user = admin;

      // Make sure role is always admin
      req.user.role = "admin";


      return next();

    }


    // =================================
    // NORMAL USER
    // =================================

    const user =
      await User.findById(
        decoded.id
      ).select("-password");


    if (!user) {

      return res.status(401).json({

        message:
          "User not found."

      });

    }


    // Attach user to request
    req.user = user;


    next();


  } catch (error) {

    console.error(
      "Authentication error:",
      error
    );


    return res.status(401).json({

      message:
        "Not authorized. Invalid token."

    });

  }

};


module.exports = protect;