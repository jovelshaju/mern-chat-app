const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

//Routes
router.get("/", protect, userController.getUsers);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

module.exports = router;
