import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";

export const sendEmail = async ({ email, subject, url, message, attachments }) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Motorent Inc. Project < ${process.env.EMAIL_USERNAME} >`,
    to: email,
    subject,
    // html,
    html: url ? emailTemplate(url, message) : message ,
    attachments
  };

  // 3) send the email
  const sendEmail = await transporter.sendMail(mailOptions);
  return sendEmail.accepted.length < 1 ? false : true;
};

export default sendEmail;
