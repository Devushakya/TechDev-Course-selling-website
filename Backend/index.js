const express = require("express");
const app = express();

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");


dotenv.config();


const PORT = process.env.PORT || 4000;


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Connect to the database
database.dbConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));

// Connect to Cloudinary
cloudConnect();

// Routes
const courseRoute = require("./routes/courseroute");
const paymentRoute = require("./routes/paymentroute");
const profileRoute = require("./routes/profileroute");
const userRoute = require("./routes/userroute");

app.use("/api/v1", courseRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", profileRoute);
app.use("/api/v1", userRoute);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
