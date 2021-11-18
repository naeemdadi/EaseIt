const express = require("express");
const Company = require("../models/companyModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const { userAuth, checkRole } = require("../utils/auth");

const taskRouter = express.Router();

// New Task
taskRouter.post(
  "/newtask",
  userAuth,
  checkRole(["superAdmin", "admin"]),
  async (req, res) => {
    const { taskName, projectName, taskDesc, taskDeadline } = req.body.data;
    const { companyId, members } = req.body;
    try {
      // Create and save new task
      const createdTask = await Task({
        taskName,
        projectName,
        taskDesc,
        companyId,
        members,
        taskDeadline,
      });
      const newTask = await createdTask.save();

      // Add Task id to Companies task list
      await Company.findByIdAndUpdate(
        companyId,
        { $push: { tasks: { _id: newTask._id } } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: "Task is successfully created.",
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, Please try again!", success: false, err });
    }
  }
);

// Get All the Tasks
taskRouter.get("/gettasks", userAuth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    const tasks = await Task.find({ _id: { $in: company.tasks } });
    const userIncludedTasks = tasks.filter((task) => {
      if (task.members.includes(req.user._id)) {
        return task;
      }
    });
    res.status(200).json({ success: true, userIncludedTasks });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error, please try again!", success: false, err });
  }
});

// Update Task Status
taskRouter.patch(
  "/updatestatus",
  userAuth,
  checkRole(["superAdmin", "admin"]),
  async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.body._id,
        { status: !req.body.status },
        { new: true }
      );
      res.status(200).json({ updatedTask, success: true });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", err, success: false });
    }
  }
);

// Update the task data
taskRouter.patch(
  "/updatetask",
  userAuth,
  checkRole(["superAdmin", "admin"]),
  async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
      });
      res.status(200).json({ updatedTask, success: true });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", err, success: false });
    }
  }
);

// Delete Task
taskRouter.delete(
  "/deletetask/:id",
  userAuth,
  checkRole(["superAdmin", "admin"]),
  async (req, res) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ message: "Task successfully deleted", success: true });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", success: false });
    }
  }
);

module.exports = taskRouter;
