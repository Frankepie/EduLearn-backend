const https = require("https");

// =====================================
// SEND EMAIL THROUGH BREVO API
// =====================================

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = JSON.stringify({
      sender: {
        name: "EduLearn",
        email: process.env.MAIL_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const result = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          let parsedBody;

          try {
            parsedBody = body ? JSON.parse(body) : {};
          } catch {
            parsedBody = body;
          }

          if (
            response.statusCode >= 200 &&
            response.statusCode < 300
          ) {
            resolve({
              statusCode: response.statusCode,
              body: parsedBody,
            });
          } else {
            reject(
              new Error(
                `Brevo API error ${response.statusCode}: ${body}`
              )
            );
          }
        });
      });

      request.on("error", (error) => {
        reject(error);
      });

      request.write(data);
      request.end();
    });

    console.log(
      "Email sent successfully through Brevo:",
      result.body
    );

    return result;
  } catch (error) {
    console.error("Brevo API email error:", error);
    throw error;
  }
};

module.exports = sendEmail;