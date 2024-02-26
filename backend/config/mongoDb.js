const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to MongoDB. Error: ${error}`);
    process.exit();
  }
};

module.exports = connectDB;
