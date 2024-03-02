const express = require("express");
const asyncHandler = require("express-async-handler");
const UserDB = require("../models/database/userModel");
const genarateToken = require("../services/tokenGenerationService");

const registerUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const userExists = await UserDB.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await UserDB.create(req.body);

  if (user) {
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: genarateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Request should not be empty");
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const user = await UserDB.findOne({ email });

  if (user && (await user.validatePassword(password))) {
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: genarateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

module.exports = { registerUser, loginUser };
