const express = require("express");
const User = require("../models/userModel");
const {
  userLogin,
  userAuth,
  checkRole,
  superAdminRegister,
  employeeRegister,
  guestUserLogin,
} = require("../utils/auth");
const upload = require("../utils/multer");

const userRouter = express.Router();

// Users Registration Route
userRouter.post(
  "/registerSuperAdmin",
  upload.single("image"),
  async (req, res) => {
    await superAdminRegister(req.body, req.file, res);
  }
);

userRouter.post(
  "/registerEmployee",
  upload.single("image"),
  async (req, res) => {
    await employeeRegister(req.body, req.file, res);
  }
);

// User Login Route
userRouter.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});

// Guest User Login Route
userRouter.post("/guestLogin", async (req, res) => {
  await guestUserLogin(req.body, res);
});

// Employee Update
userRouter.patch(
  "/updateEmployee",
  userAuth,
  checkRole(["superAdmin"]),
  async (req, res) => {
    if (req.user.companyId.toString() !== req.body.companyId) {
      res
        .status(400)
        .json({ message: `You are not part of this org!`, success: false });
    }
    try {
      const updateEmployee = await User.findByIdAndUpdate(
        req.body._id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json(updateEmployee);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", err, success: false });
    }
  }
);

module.exports = userRouter;
