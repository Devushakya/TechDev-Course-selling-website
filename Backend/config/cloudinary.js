const cloudinary = require("cloudinary").v2;
exports.cloudConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.api_secret,
    });
    console.log("Connection with Cloud successful");
  } catch (error) {
    console.error(error);
    console.log("Error while connecting to cloud");
  }
};
