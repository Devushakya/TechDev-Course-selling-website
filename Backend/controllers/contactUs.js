const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.contactUs = async (req, res) => {
  try {
    const { firstname, lastname, email, phoneNo, message } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !email || !phoneNo || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required details.", 
      });
    }

    // Email template for user
    const userEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contact Us Response</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #007bff;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 1.5rem;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .footer {
            text-align: center;
            padding: 10px;
            background-color: #f1f1f1;
            font-size: 0.9rem;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            Contact Us Response
          </div>
          <div class="content">
            <p>Dear ${firstname} ${lastname},</p>
            <p>Thank you for reaching out to us. We have received your message and will get back to you within 2-3 business days.</p>
            <p>We appreciate your patience and understanding.</p>
          </div>
          <div class="footer">
            <p>Thank you for contacting us.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email template for admin
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contact Us Submission</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #007bff;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 1.5rem;
          }
          .content {
            padding: 20px;
            text-align: left;
          }
          .footer {
            text-align: center;
            padding: 10px;
            background-color: #f1f1f1;
            font-size: 0.9rem;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            Contact Us Submission
          </div>
          <div class="content">
            <p>A user has submitted a contact request with the following details:</p>
            <p><strong>Name:</strong> ${firstname} ${lastname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNo}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <div class="footer">
            <p>Contact Us System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to the user
    await mailSender("Contact Us Response", userEmailHTML, email);

    // Send email to the admin with user details
    await mailSender(
      "Contact Us Submission",
      adminEmailHTML,
      process.env.ADMIN_MAIL
    );

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Your contact request was submitted successfully.",
    });
  } catch (error) {
    console.error("Error in contactUs handler:", error);

    // Respond with error
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
