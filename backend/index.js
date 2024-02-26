const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const connectDB = require("./config/mongoDb");

connectDB();

const app = express();

//Constants
const PORT = process.env.PORT;

//Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ChatApp with MERN!",
  });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
