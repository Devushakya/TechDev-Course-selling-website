const Usermodel = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//sending link
exports.resetPasswordToken = async (req, res) => {
  try {
    //getting data
    const { email } = req.body;

    const user = await Usermodel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user email is not registered",
      });
    }

    //creting a token(unique string) so that with help of it we can find user
    const token = crypto.randomUUID();
    //updating details to user
    const updateDetails = await Usermodel.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    //creating url to send in mail
    const url = `https://techdev-course-selling-website.onrender.com/update-password/${token}`;
    //sending url in mail
    const passwordResetHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Reset</title>
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
            background-color: #dc3545;
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
            Password Reset Request
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>We received a request to reset your password. Please use the link below to reset your password:</p>
            <p><a href="${url}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>
            <p>This link is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Thank you for using our service.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await mailSender("Password Reset Link", passwordResetHTML, email);
    return res.status(200).json({
      success: true,
      message: "password reset link is successfuly sended to user",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message:
        "error happende while sending reset password link,Please try again",
    });
  }
};

//actual reset password
exports.resetpassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // Logging the values to debug
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("token:", token);

    // Check if both passwords match
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Both passwords don't match, please enter them correctly",
      });
    }

    // Finding user using token
    const userDetails = await Usermodel.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    // Checking if token is expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    // Hashing the password
    const hashedpassword = await bcrypt.hash(password, 10);

    // Updating the user password
    await Usermodel.findOneAndUpdate(
      { token: token },
      { password: hashedpassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password has been successfully changed",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message:
        "An error occurred while resetting the password. Please try again",
    });
  }
};
