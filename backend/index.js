const express = require("express");
require("dotenv").config();
const connectDB = require("./services/mongoDbService");

connectDB();

//Constants
const app = express();
const PORT = process.env.PORT;
const api = require("./routes");
const errorMiddleware = require("./middleware/errorMiddleware"); //Used to throw proper error response

//MiddleWares
app.use(express.json());

//Routes
app.use("/api", api);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ChatApp with MERN!",
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
