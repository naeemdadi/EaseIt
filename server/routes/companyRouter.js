const express = require("express");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { userAuth, checkRole } = require("../utils/auth");

const companyRouter = express.Router();

// Get list of companies
companyRouter.get("/list", async (req, res) => {
  try {
    const companiesList = await Company.find({});
    res.status(200).json({ companiesList, success: true });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Companies not found", success: false, err });
  }
});

// Send Joining request of employee to Super Admin
companyRouter.post("/sendjoiningrequest", userAuth, async (req, res) => {
  const { uniqueId } = req.body.selectedOption;
  const { joiningPassword } = req.body;
  const userId = req.user._id;
  try {
    const selectedCompany = await Company.findOne({ uniqueId });

    // Compare company joinig password
    let comparePass = await bcrypt.compare(
      joiningPassword,
      selectedCompany.joiningPassword
    );

    if (!comparePass) {
      res
        .status(401)
        .json({ message: "Wrong password, please try again!", success: false });
    } else {
      // Check if user is already In
      const isAlreadyIn = selectedCompany.users.filter(
        (user) => user._id.toString() === userId.toString()
      );
      if (isAlreadyIn.length > 0) {
        res.status(500).json({
          message: "You are already part of the Organization!",
          success: false,
        });
      } else {
        const updateCompanyData = await Company.findByIdAndUpdate(
          selectedCompany._id,
          { users: [...selectedCompany.users, { _id: userId }] },
          { new: true }
        );

        const updateUserData = await User.findByIdAndUpdate(
          userId,
          { companyId: updateCompanyData._id },
          { new: true }
        );

        res.status(200).json({
          message: `You have successfully joined the ${selectedCompany.companyName}`,
          updateCompanyData: {
            _id: updateCompanyData._id,
            companyName: updateCompanyData.companyName,
            uniqueId: updateCompanyData.uniqueId,
            users: [...updateCompanyData.users],
          },
          updateUserData,
          success: true,
        });
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error, please try again!", success: false, err });
  }
});

companyRouter.get(
  "/getemployees",
  userAuth,
  checkRole(["superAdmin", "admin"]),
  async (req, res) => {
    const companyId = req.user.companyId;
    try {
      const findCompany = await Company.findById(companyId);
      const employees = await User.find({
        _id: { $in: findCompany.users },
      }).select(["-password"]);
      res.status(200).json({ employees: employees, success: true });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", success: false });
    }
  }
);

companyRouter.post(
  "/makeanadmin",
  userAuth,
  checkRole(["superAdmin"]),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.body.id,
        { role: "admin" },
        { new: true }
      ).select(["-password"]);
      res.status(200).json({
        message: "User data is successfully updated",
        updatedUser,
        success: true,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", success: false });
    }
  }
);

companyRouter.post(
  "/removeanadmin",
  userAuth,
  checkRole(["superAdmin"]),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.body.id,
        { role: "employee" },
        { new: true }
      ).select(["-password"]);
      res.status(200).json({
        message: "User data is successfully updated",
        updatedUser,
        success: true,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error, please try again!", success: false });
    }
  }
);

module.exports = companyRouter;
