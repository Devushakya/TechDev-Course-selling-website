const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (title, body, email) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "TechDev- WebProject by Devesh Shakaya",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (error) {
    console.log("error in mail sender");
    console.error(error);
  }
};

module.exports = mailSender;
