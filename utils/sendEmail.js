const {Resend} = require("resend");
const resend = new Resend (process.env.RESEND_API_KEY);
const sendEmail = async ({to, subject, html}) =>{
  try{
    const {data, error} = await resend.emails.send({
      from: process.env.MAIL_FROM || "Edulearn <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });
    if (error){
      console.error("Resend email error:",error);
      throw new Error(error.message || "Failed to send email");
    }
    console.log(`Email sent successfully to ${to}`);
    console.log("Resend email ID:", data?.id);
    return data;
  }catch(error){
    console.error("Email sending error:", error);
    throw error;
  }
};
module.exports = sendEmail;