const nodemailer = require("nodemailer");

// =====================================
// BREVO SMTP TRANSPORTER
// =====================================

const transporter = nodemailer.createTransport({

  host: "smtp-relay.brevo.com",

  port: 587,

  secure: false,

  auth: {

    user:
      process.env.BREVO_SMTP_USER,

    pass:
      process.env.BREVO_SMTP_KEY

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

    const info =
      await transporter.sendMail({

        from: {
          name:
            process.env.MAIL_FROM_NAME ||
            "EduLearn",

          address:
            process.env.MAIL_FROM
        },

        to,

        subject,

        html

      });

    console.log(
      "Brevo email sent:",
      info.messageId
    );

    return info;

  } catch (error) {

    console.error(
      "Brevo SMTP error:",
      error
    );

    throw error;

  }

};


module.exports = sendEmail;