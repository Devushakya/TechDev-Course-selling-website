const Usermodel = require("../models/User");
const OTPmodel = require("../models/OTP");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profilemodel = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//otp sending controller
exports.sendOTP = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    //finding kahi user pelhe se to nhi hai
    const finduser = await Usermodel.findOne({ email });
    if (finduser) {
      return res.status(401).json({
        status: false,
        message: "user already exists so no OTP",
      });
    }
    //generating random otp and make sure its not present in otp model
    var otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let result = await OTPmodel.findOne({ otp });
    //jab tak uniquie otp nhi milti tab tak banao
    //bekar code not use in industry

    while (result) {
      otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      result = await OTPmodel.findOne({ otp });
    }

    //now inserting otp in otp model
    const otpmodelinsert = { email, otp };
    const otpBody = await OTPmodel.create(otpmodelinsert);
    // console.log("OTP body=>", otpBody);
    await mailSender(
      "OTP Verification for SignIn in TechDev",
      `<!DOCTYPE html>
<html>
<head>
  <title>OTP for TechDev Sign-In</title>
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
    .otp {
      font-size: 2rem;
      color: #007bff;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background-color: #f1f1f1;
      font-size: 0.9rem;
      color: #555;
    }
    .footer a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      TechDev Sign-In OTP
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for signing into TechDev is:</p>
      <div class="otp">${otp}</div>
      <p>Please use this OTP to complete your sign-in. This OTP is valid for 10 minutes.</p>
      <p>If you did not request this OTP, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Thank you for using TechDev.</p>
    </div>
  </div>
</body>
</html>
`,
      email
    );

    return res.status(200).json({
      message: "OTP is successfully created",
      success: true,
      otp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//sign up
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contactNumber,
      otp,
      confirmPassword,
    } = req.body;

    //checkings
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Enter all the fields to sign up",
      });
    }
    //checking same password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Eneter same password",
      });
    }

    //checking user exist
    const user = await Usermodel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists to sign in",
      });
    }

    //finding most recent otp in user OTP model
    const recentOTP = await OTPmodel.find({ email:email })
      .sort({ createdAt: -1 })
      .limit(1);
    //sort sort krega createdAt ke basis par -1 means sabse recent uper rhega and limit 1 matlab
    //bas 1 he vapas ayega
    if (recentOTP.length == 0) {
      return res.status(400).json({
        success: false,
        message: "no otp found in user ... you are hacker",
      });
    } else if (otp !== recentOTP[0].otp) {
      return res.status(400).json({
        success: false,
        message: "OTp don't matched please give valid OTP",
      });
    }

    //Hashed password
    const hashedpassword = await bcrypt.hash(password, 10);
    //creating profile for user
    const profileforuser = await Profilemodel.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber,
    });

    //creating entry in database
    const usercreated = await Usermodel.create({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      accountType,
      additionalDetails: profileforuser._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User signUp successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be regestired please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Enter email and password to login",
      });
    }

    //finding user
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exists to log in",
      });
    }

    //checking password and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      //sahi hai
      const payload = {
        email: user.email,
        accountType: user.accountType,
        id: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      //creating cookie and sending success response
      res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        token,
        message: "User loged in successfully",
      });
    } else {
      //galat password hai
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure , Please try again",
    });
  }
};

//change password
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Checking if all fields are provided
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Confirm that new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Find user by email
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password (implementation left incomplete)
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing password",
    });
  }
};
