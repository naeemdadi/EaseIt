const express = require("express");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const { userAuth, checkRole } = require("../utils/auth");

const messageRouter = express.Router();

// New Message
messageRouter.post("/newmessage", userAuth, async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(201).json({ savedMessage, success: true });
  } catch (err) {
    res.status(500).json({ err, success: false });
  }
});

// Get task Messages
messageRouter.get("/:taskId", userAuth, async (req, res) => {
  try {
    const messages = await Message.find({ taskId: req.params.taskId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Task Members
messageRouter.post("/taskmembers", async (req, res) => {
  try {
    const members = await User.find({ _id: { $in: req.body } }).select([
      "-password",
    ]);
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = messageRouter;
