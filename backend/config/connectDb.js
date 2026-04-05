const mongoose = require("mongoose");
require("dotenv").config(); // Add this line
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connection successful: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: Database connection failed: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
