const mongoose = require("mongoose");
require("dotenv").config();


exports.dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_LINK)
    .then(console.log("Conncetion with database successful"))
    .catch((error) => {
      console.log("Error while connecting to database");
      console.error(error);
      process.exit(1);
    });
};
