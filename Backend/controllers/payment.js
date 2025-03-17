const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const courseModel = require("../models/Course");
const userModel = require("../models/User");
const mailSender = require("../utils/mailSender");
const courseProgressModel = require("../models/CourceProgress");
const crypto = require("crypto");
require("dotenv").config();

//capturing the payment
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course IDs" });
  }

  let total_amount = 0;

  try {
    for (const course_id of courses) {
      const course = await courseModel.findById(course_id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Could not find the course with ID: ${course_id}`,
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);

      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: `User is already enrolled in course with ID: ${course_id}`,
        });
      }

      total_amount += Number(course.price);
      console.log("total amount", total_amount);
    }

    const options = {
      amount: total_amount * 100, // Convert to paise
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    console.log("Razorpay Options:", options);

    const paymentResponse = await instance.orders.create(options);
    console.log("Payment Response:", paymentResponse);

    return res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not initiate order.",
      error: error, // Full error object for debugging
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }
  console.log("RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET);
  //ab razorpay wale bole aur hum kar diye
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await courseModel.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await courseProgressModel.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await userModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            course: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);
      // Send an email notification to the enrolled student

      const courseEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Course Enrollment</title>
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
            background-color: #f9bc05;
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
            Course Enrollment Confirmation
          </div>
          <div class="content">
            <p>Dear ${enrolledStudent.firstName},</p>
            <p>Congratulations on enrolling in your new course ${enrolledCourse.courseName}!</p>
            <p>We are excited to have you on board and look forward to supporting you in your learning journey.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing our platform.</p>
          </div>
        </div>
      </body>
      </html>
    `;
      const emailResponse = await mailSender(
        "New Course Enrollment",
        courseEmailHTML,
        enrolledStudent?.email
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await userModel.findById(userId);

    const Payment_bodyMail = `<!DOCTYPE html>
    <html>
    <head>
    <title>Payment Success</title>
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
      background-color: #28a745;
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
      Payment Confirmation
    </div>
    <div class="content">
      <p>Dear ${enrolledStudent.firstName} ${enrolledStudent.lastName},</p>
      <p>We are delighted to inform you that your payment has been successfully processed.</p>
      <p><strong>Payment Details:</strong></p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</li>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Payment ID:</strong> ${paymentId}</li>
      </ul>
      <p>Thank you for choosing our platform. We look forward to serving you!</p>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Thank you for your trust and support!</p>
    </div>
  </div>
</body>
</html>
`;

    await mailSender(
      `Payment Received`,
      Payment_bodyMail,
      enrolledStudent.email
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};
