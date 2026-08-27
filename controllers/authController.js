const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const OTP = require("../models/OTP");

const sendEmail = require("../utils/sendEmail");

const {
  createNotification
} = require("./notificationController");

// ===============================
// OTP HELPERS
// ===============================

const generateOTP = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};


const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};


const sendOTPEmail = async ({
  email,
  otp,
  purpose
}) => {

  const isRegistration =
    purpose === "registration";

  const subject = isRegistration
    ? "EduLearn Registration Verification Code"
    : "EduLearn Password Reset Code";


  const title = isRegistration
    ? "Verify Your EduLearn Account"
    : "Reset Your EduLearn Password";


  const message = isRegistration
    ? "Use the verification code below to complete your EduLearn registration."
    : "Use the verification code below to reset your EduLearn password.";


  await sendEmail({
    to: email,

    subject,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 30px;
      ">

        <h2 style="
          color: #30269b;
          text-align: center;
        ">
          EduLearn
        </h2>

        <h3 style="text-align: center;">
          ${title}
        </h3>

        <p>
          ${message}
        </p>

        <div style="
          text-align: center;
          margin: 30px 0;
        ">

          <span style="
            display: inline-block;
            background: #30269b;
            color: white;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 15px 25px;
            border-radius: 8px;
          ">
            ${otp}
          </span>

        </div>

        <p>
          This code will expire in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not request this code,
          you can safely ignore this email.
        </p>

        <p>
          EduLearn Team
        </p>

      </div>
    `
  });
};
// ===============================
// REGISTER USER
// ===============================

const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;


    if (!name || !email || !password) {

      return res.status(400).json({
        message:
          "Please provide all required fields"
      });

    }


    const normalizedEmail =
      email.trim().toLowerCase();


    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });


    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists"
      });

    }


    // Only student and instructor
    // can be created through public registration.
    const selectedRole =
      role === "instructor"
        ? "instructor"
        : "student";


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const otp =
      generateOTP();


    const otpHash =
      hashOTP(otp);


    const expiresAt =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );


    // Remove an older registration OTP
    // for this email.
    await OTP.deleteMany({
      email: normalizedEmail,
      purpose: "registration"
    });


    await OTP.create({

      email: normalizedEmail,

      purpose: "registration",

      otpHash,

      expiresAt,

      lastSentAt: new Date(),

      registrationData: {

        name: name.trim(),

        passwordHash:
          hashedPassword,

        role: selectedRole

      }

    });


    await sendOTPEmail({

      email: normalizedEmail,

      otp,

      purpose: "registration"

    });


    return res.status(200).json({

      message:
        "Verification code sent to your email.",

      verificationRequired: true,

      email: normalizedEmail

    });


  } catch (error) {

    console.error(
      "Registration OTP error:",
      error
    );


    return res.status(500).json({
      message:
        "Unable to start registration"
    });

  }

};
// ===============================
// VERIFY REGISTRATION OTP
// ===============================

const verifyRegistrationOTP = async (
  req,
  res
) => {

  try {

    const {
      email,
      otp
    } = req.body;


    if (!email || !otp) {

      return res.status(400).json({
        message:
          "Email and OTP are required"
      });

    }


    const normalizedEmail =
      email.trim().toLowerCase();


    const otpRecord =
      await OTP.findOne({
        email: normalizedEmail,
        purpose: "registration"
      });


    if (!otpRecord) {

      return res.status(400).json({
        message:
          "Verification code expired or not found"
      });

    }


    if (
      otpRecord.expiresAt <
      new Date()
    ) {

      await OTP.deleteOne({
        _id: otpRecord._id
      });

      return res.status(400).json({
        message:
          "Verification code has expired"
      });

    }


    if (otpRecord.attempts >= 5) {

      await OTP.deleteOne({
        _id: otpRecord._id
      });

      return res.status(429).json({
        message:
          "Too many incorrect attempts. Please request a new code."
      });

    }


    const suppliedHash =
      hashOTP(
        otp.toString().trim()
      );


    if (
      suppliedHash !==
      otpRecord.otpHash
    ) {

      otpRecord.attempts += 1;

      await otpRecord.save();

      return res.status(400).json({
        message:
          "Invalid verification code"
      });

    }


    // Check again in case the account
    // was created elsewhere.
    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });


    if (existingUser) {

      await OTP.deleteOne({
        _id: otpRecord._id
      });

      return res.status(400).json({
        message:
          "User already exists"
      });

    }


    const user =
      await User.create({

        name:
          otpRecord.registrationData.name,

        email:
          normalizedEmail,

        password:
          otpRecord.registrationData.passwordHash,

        role:
          otpRecord.registrationData.role

      });


    // Delete OTP immediately after
    // successful verification.
    await OTP.deleteOne({
      _id: otpRecord._id
    });


    // ===============================
    // NOTIFY ADMINS
    // ===============================

    try {

      const admins =
        await User.find({
          role: "admin"
        }).select("_id");


      for (
        const admin of admins
      ) {

        await createNotification({

          recipient:
            admin._id,

          title:
            "New User Registered",

          message:
            `${user.name} has registered as a ${user.role}.`,

          type:
            "user"

        });

      }

    } catch (
      notificationError
    ) {

      console.error(
        "Notification creation failed:",
        notificationError
      );

    }


    return res.status(201).json({

      message:
        "Email verified and account created successfully",

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role

      }

    });


  } catch (error) {

    console.error(
      "Registration OTP verification error:",
      error
    );


    return res.status(500).json({
      message:
        "Server error"
    });

  }

};
// ===============================
// RESEND REGISTRATION OTP
// ===============================

const resendRegistrationOTP =
  async (req, res) => {

    try {

      const {
        email
      } = req.body;


      if (!email) {

        return res.status(400).json({
          message:
            "Email is required"
        });

      }


      const normalizedEmail =
        email.trim().toLowerCase();


      const record =
        await OTP.findOne({
          email: normalizedEmail,
          purpose: "registration"
        });


      if (!record) {

        return res.status(400).json({
          message:
            "Registration session not found. Please register again."
        });

      }


      const timeSinceLastSent =
        Date.now() -
        new Date(
          record.lastSentAt
        ).getTime();


      // 60-second resend protection.
      if (
        timeSinceLastSent <
        60 * 1000
      ) {

        return res.status(429).json({
          message:
            "Please wait before requesting another code."
        });

      }


      const otp =
        generateOTP();


      record.otpHash =
        hashOTP(otp);


      record.expiresAt =
        new Date(
          Date.now() +
          10 * 60 * 1000
        );


      record.lastSentAt =
        new Date();


      record.attempts = 0;


      await record.save();


      await sendEmail({
  to: normalizedEmail,
  subject: "Your EduLearn Verification Code",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome to EduLearn</h2>

      <p>Your registration verification code is:</p>

      <h1>${otp}</h1>

      <p>This code will expire in 10 minutes.</p>

      <p>If you did not create an EduLearn account, you can ignore this email.</p>
    </div>
  `
});

      return res.status(200).json({

        message:
          "A new verification code has been sent."

      });


    } catch (error) {

      console.error(
        "Resend registration OTP error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to resend verification code"
      });

    }

  };

// ===============================
// LOGIN USER
// ===============================

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required"
      });
    }

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({

      message: "Login successful",

      token,

    user: {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage
}

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


  // ===============================
// FORGOT PASSWORD
// ===============================

const forgotPassword =
  async (req, res) => {

    try {

      const {
        email
      } = req.body;


      if (!email) {

        return res.status(400).json({
          message:
            "Email is required"
        });

      }


      const normalizedEmail =
        email.trim().toLowerCase();


      const user =
        await User.findOne({
          email: normalizedEmail
        });


      // Don't reveal whether the email
      // exists in the system.
      if (!user) {

        return res.status(200).json({
          message:
            "If an account exists with this email, a verification code has been sent."
        });

      }


      const otp =
        generateOTP();


      await OTP.deleteMany({
        email: normalizedEmail,
        purpose: "password_reset"
      });


      await OTP.create({

        email: normalizedEmail,

        purpose:
          "password_reset",

        otpHash:
          hashOTP(otp),

        expiresAt:
          new Date(
            Date.now() +
            10 * 60 * 1000
          ),

        lastSentAt:
          new Date()

      });


      await sendOTPEmail({

        email:
          normalizedEmail,

        otp,

        purpose:
          "password_reset"

      });


      return res.status(200).json({

        message:
          "If an account exists with this email, a verification code has been sent.",

        verificationRequired:
          true,

        email:
          normalizedEmail

      });


    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to process password reset request"
      });

    }

  };
// ===============================
// VERIFY PASSWORD RESET OTP
// ===============================

const verifyPasswordResetOTP =
  async (req, res) => {

    try {

      const {
        email,
        otp
      } = req.body;


      if (!email || !otp) {

        return res.status(400).json({
          message:
            "Email and OTP are required"
        });

      }


      const normalizedEmail =
        email.trim().toLowerCase();


      const otpRecord =
        await OTP.findOne({
          email: normalizedEmail,
          purpose: "password_reset"
        });


      if (!otpRecord) {

        return res.status(400).json({
          message:
            "Verification code expired or not found"
        });

      }


      if (
        otpRecord.expiresAt <
        new Date()
      ) {

        await OTP.deleteOne({
          _id: otpRecord._id
        });

        return res.status(400).json({
          message:
            "Verification code has expired"
        });

      }


      if (otpRecord.attempts >= 5) {

        await OTP.deleteOne({
          _id: otpRecord._id
        });

        return res.status(429).json({
          message:
            "Too many incorrect attempts. Please request a new code."
        });

      }


      const suppliedHash =
        hashOTP(
          otp.toString().trim()
        );


      if (
        suppliedHash !==
        otpRecord.otpHash
      ) {

        otpRecord.attempts += 1;

        await otpRecord.save();

        return res.status(400).json({
          message:
            "Invalid verification code"
        });

      }


      const resetToken =
        crypto.randomBytes(32)
          .toString("hex");


      otpRecord.resetTokenHash =
        hashOTP(resetToken);


      otpRecord.resetTokenExpiresAt =
        new Date(
          Date.now() +
          15 * 60 * 1000
        );


      await otpRecord.save();


      return res.status(200).json({

        message:
          "OTP verified successfully",

        resetToken

      });


    } catch (error) {

      console.error(
        "Password reset OTP verification error:",
        error
      );


      return res.status(500).json({
        message:
          "Server error"
      });

    }

  };
  // ===============================
// RESET PASSWORD
// ===============================

const resetPassword =
  async (req, res) => {

    try {

      const {
        email,
        resetToken,
        password
      } = req.body;


      if (
        !email ||
        !resetToken ||
        !password
      ) {

        return res.status(400).json({
          message:
            "Email, reset token and password are required"
        });

      }


      if (password.length < 6) {

        return res.status(400).json({
          message:
            "Password must be at least 6 characters"
        });

      }


      const normalizedEmail =
        email.trim().toLowerCase();


      const otpRecord =
        await OTP.findOne({
          email: normalizedEmail,
          purpose: "password_reset"
        });


      if (!otpRecord) {

        return res.status(400).json({
          message:
            "Password reset session expired"
        });

      }


      if (
        !otpRecord.resetTokenExpiresAt ||
        otpRecord.resetTokenExpiresAt <
          new Date()
      ) {

        await OTP.deleteOne({
          _id: otpRecord._id
        });

        return res.status(400).json({
          message:
            "Password reset session expired"
        });

      }


      const tokenHash =
        hashOTP(resetToken);


      if (
        tokenHash !==
        otpRecord.resetTokenHash
      ) {

        return res.status(400).json({
          message:
            "Invalid password reset token"
        });

      }


      const user =
        await User.findOne({
          email: normalizedEmail
        });


      if (!user) {

        return res.status(404).json({
          message:
            "User not found"
        });

      }

const samePassword =
  await bcrypt.compare(
    password,
    user.password
  );


if (samePassword) {

  return res.status(400).json({
    message:
      "Your new password must be different from your previous password."
  });

}
      user.password =
        await bcrypt.hash(
          password,
          10
        );


      await user.save();


      // Reset token becomes unusable.
      await OTP.deleteOne({
        _id: otpRecord._id
      });


      return res.status(200).json({

        message:
          "Password reset successfully"

      });


    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );


      return res.status(500).json({
        message:
          "Server error"
      });

    }
    

  };



module.exports = {
  registerUser,
  loginUser,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword
};
// try {

//   const admins =
//     await User.find({
//       role: "admin"
//     }).select("_id");


//   console.log(
//     "Admins found:",
//     admins.length
//   );


//   for (const admin of admins) {

//     await createNotification({

//       recipient: admin._id,

//       title: "New User Registered",

//       message:
//         `${user.name} has registered as a ${user.role}.`,

//       type: "user"

//     });

//   }


// } catch (notificationError) {

//   console.error(
//     "Notification creation failed:",
//     notificationError
//   );

// }