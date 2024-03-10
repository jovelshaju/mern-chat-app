const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

//Routes
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to User Routes",
  });
});
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/getUsers", protect, userController.getUsers);

module.exports = router;
