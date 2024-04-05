const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addGroupUser,
  removeGroupUser,
} = require("../controllers/chatController");

//Routes
router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/createGroup", protect, createGroupChat);
router.put("/renameGroup", protect, renameGroupChat);
router.put("/addGroupUser", protect, addGroupUser);
router.put("/removeGroupUser", protect, removeGroupUser);

module.exports = router;
