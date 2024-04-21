const express = require("express");
const asyncHandler = require("express-async-handler");
const ChatDB = require("../models/database/chatModel");
const UserDB = require("../models/database/userModel");

/**
 * Function to fetch or create one on one chat
 */
const accessChat = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("UserId is empty");
  }

  try {
    let isChat = await ChatDB.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name pic email");

    //   isChat = await UserDB.populate(isChat, {
    //     path: "latestMessage.sender",
    //     select: "name pic email",
    //   });

    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      const user = await UserDB.find({ _id: { $eq: req.user._id } });

      const newChatRequest = {
        chatName: user[0].name,
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const newChat = await ChatDB.create(newChatRequest);
      const createdChat = await ChatDB.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(createdChat);
    }
  } catch (error) {
    res.status(400);
    throw new Error("Unable to find or create the chat");
  }
});

/**
 * Function fetch all the chats current user is part of
 */
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await ChatDB.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name pic email")
      .sort({ updatedAt: -1 });

    res.status(200).send(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * Function to create a group chat
 */
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  let { groupName, users } = req.body;

  if (!groupName || !users) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  if (users.includes(req.user.id)) {
    res.status(400);
    throw new Error("Invalid request parameters");
  }

  users.push(req.user.id);

  try {
    const createGroupChatRequest = {
      chatName: groupName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    };

    const newGroupChat = await ChatDB.create(createGroupChatRequest);
    const createdChat = await ChatDB.findOne({ _id: newGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(createdChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * Function to rename a group chat
 */
const renameGroupChat = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  const { groupName, chatId } = req.body;

  if (!groupName || !chatId) {
    res.status(400);
    throw new Error("Invalid request");
  }

  try {
    const groupChat = await ChatDB.findByIdAndUpdate(
      chatId,
      {
        chatName: groupName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(groupChat);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

/**
 * Function to add a user to a group
 */
const addGroupUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Invalid request");
  }

  try {
    const userExists = await ChatDB.find({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });

    if (userExists.length > 0) {
      res.status(400);
      throw new Error("User already added");
    }

    const groupChat = await ChatDB.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(groupChat);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

/**
 * Function to remove a user from a group
 */
const removeGroupUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Invalid request");
  }

  try {
    const groupChat = await ChatDB.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(groupChat);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addGroupUser,
  removeGroupUser,
};
