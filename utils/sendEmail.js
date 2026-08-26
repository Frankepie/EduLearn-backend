const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  // Force IPv4 because Render was trying to reach Gmail
  // through IPv6 and returning ENETUNREACH.
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    minVersion: "TLSv1.2",
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = sendEmail;