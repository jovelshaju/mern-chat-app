const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./services/mongoDbService");
const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");

connectDB();

//Constants
const app = express();
const PORT = process.env.PORT;
const api = require("./routes");
//Used to throw proper error response

//MiddleWares
app.use(express.json());
app.use(cors());

//Routes
app.use("/api", api);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ChatApp with MERN!",
  });
});

app.use(notFound);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
