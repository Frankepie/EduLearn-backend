const nodemailer = require("nodemailer");

// =====================================
// BREVO SMTP TRANSPORTER
// =====================================

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT) || 587,
  secure: false,

  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY
  }
});


// =====================================
// SEND EMAIL
// =====================================

const sendEmail = async ({
  to,
  subject,
  html
}) => {

  try {

    const info = await transporter.sendMail({

      from: {
        name: "EduLearn",
        address: process.env.MAIL_FROM
      },

      to,

      subject,

      html

    });

    console.log(
      "Email sent successfully:",
      info.messageId
    );

    return info;

  } catch (error) {

    console.error(
      "Brevo SMTP email error:",
      error
    );

    throw error;

  }

};


module.exports = sendEmail;