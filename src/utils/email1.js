import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, html, attachments }) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD, "email");
  // 2) Define the email options
  const mailOptions = {
    from: `ITI - Ecommerce < ${process.env.EMAIL_USERNAME} >`,
    to: email,
    subject,
    html,
    attachments,
  };

  // 3) send the email
  const sendEmail = await transporter.sendMail(mailOptions);
  return sendEmail.accepted.length < 1 ? false : true;
};
