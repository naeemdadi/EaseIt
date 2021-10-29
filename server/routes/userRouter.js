const express = require("express");
const {
  userLogin,
  userAuth,
  checkRole,
  userAndCompanyRegister,
  superAdminRegister,
  employeeRegister,
} = require("../utils/auth");

const userRouter = express.Router();

// Users Registration Route
userRouter.post("/registerSuperAdmin", async (req, res) => {
  await superAdminRegister(req.body, res);
});

userRouter.post("/registerEmployee", async (req, res) => {
  await employeeRegister(req.body, res);
});

// User Login Route
userRouter.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});

// User Profile
userRouter.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.body));
});

// User Protected Route
userRouter.get(
  "/employee",
  userAuth,
  checkRole(["employee"]),
  async (req, res) => {
    return res.json("Hello Employee!");
  }
);

// Admin protected route
userRouter.get("/admin", userAuth, checkRole(["admin"]), async (req, res) => {
  return res.json("Hello Admin!");
});

// Superadmin protected route
userRouter.get(
  "/super-admin",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Superadmin!");
  }
);

// Superadmin and Admin protected route
userRouter.get(
  "/super-admin-and-admin",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Hello Admin and Super Admin!");
  }
);

module.exports = userRouter;
