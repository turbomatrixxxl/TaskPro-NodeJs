const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const senderEmail = process.env.SECRET_EMAIL;
const destination = process.env.SECRET_EMAIL_TO_SEND;

const sendHelpEmail = async (email, comment) => {
  if (!email) throw new Error("Email is missing...!");
  if (!comment) throw new Error("Comment is missing...!");

  const msg = {
    to: destination,
    from: senderEmail,
    subject: "Help request",
    text: `From ${email}. Request: ${comment} `,
    html: `<p>From ${email}</p>
             <p>Request: ${comment}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Help request email sent!");
    return {
      email: email,
      comment: comment,
    }; // Return the email and the comment sent.
  } catch (error) {
    console.error("Email not sent! Error:", error.message);
    throw new Error(`Email not sent! The error is: ${error.message}`);
  }
};

module.exports = sendHelpEmail;
