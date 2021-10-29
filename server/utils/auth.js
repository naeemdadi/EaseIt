const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Company = require("../models/companyModel");
const fs = require("fs");

// Super Admin Registration and COmpany Initialization
const superAdminRegister = async (userInfo, res) => {
  const { company, role, userData } = userInfo;
  try {
    // Validate email
    let isEmailAvailable = await validateEmail(userData.email);
    if (!isEmailAvailable) {
      return res
        .status(400)
        .json({ message: "Email is already registered!", success: false });
    }

    // Validate Company Unique Id
    let isCompanyAvailable = await validateCompany(company.companyUniqueId);
    if (!isCompanyAvailable) {
      return res.status(400).json({
        message: "This company unique id is taken, please try something else.",
        success: false,
      });
    }

    // Create hash password
    const hashedUserPassword = await bcrypt.hash(userData.password, 12);

    // Create Company hash password
    const hashedCompanyPassword = await bcrypt.hash(
      company.joiningPassword,
      12
    );

    // Add new User
    const newUser = new User({
      email: userData.email,
      role: role,
      name: userData.name,
      designation: userData.designation,
      password: hashedUserPassword,
    });
    const createdUser = await newUser.save();

    // Initialize new Firm
    const newCompany = new Company({
      companyName: company.companyName,
      uniqueId: company.companyUniqueId,
      joiningPassword: hashedCompanyPassword,
      users: [{ _id: createdUser._id }],
    });
    const createdCompany = await newCompany.save();

    await User.findByIdAndUpdate(createdUser._id, {
      companyId: createdCompany._id,
    });

    return res.status(201).json({
      message: `Hi ${
        createdUser.name.split(" ")[0]
      }, you are successfully registered. Sign In to start Working.`,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Account creation failed, please try again!`,
      err,
      success: false,
    });
  }
};

// Employee Registration and Firm Association
const employeeRegister = async (userInfo, res) => {
  try {
    // Validate email
    let isEmailAvailable = await validateEmail(userInfo.email);

    if (!isEmailAvailable) {
      return res
        .status(400)
        .json({ message: "Email is already registered!", success: false });
    }
    // Create User hash password
    const hashedPassword = await bcrypt.hash(userInfo.password, 12);
    // Add new User
    const newUser = new User({
      email: userInfo.email,
      name: userInfo.name,
      designation: userInfo.designation,
      // profilePic: buffer,
      password: hashedPassword,
    });
    const createdUser = await newUser.save();
    return res.status(201).json({
      message: `Hi ${
        createdUser.name.split(" ")[0]
      }, you are successfully registered. Sign In to start Working.`,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Account creation failed, please try again!`,
      err,
      success: false,
    });
  }
};

// User Login
const userLogin = async (userInfo, res) => {
  let { email, password } = userInfo;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid login credientials.", success: false });
    }

    // Compare passwords
    let comparePass = await bcrypt.compare(password, user.password);
    if (comparePass) {
      if (user.companyId) {
        const userCompany = await Company.findById(user.companyId);
        // Sign in and issue Token
        res.status(200).send({
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            designation: user.designation,
            companyId: user.companyId,
            token: `Bearer ${generateToken(user)}`,
            message: `Hi ${
              user.name.split(" ")[0]
            }, you're successfullty logged in!`,
            success: true,
          },
          company: {
            _id: userCompany._id,
            companyName: userCompany.companyName,
            users: [...userCompany.users],
          },
          expiresIn: 168,
        });
      } else {
        res.status(200).send({
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            companyId: user.companyId,
            designation: user.designation,
            token: `Bearer ${generateToken(user)}`,
            message: `Hi ${
              user.name.split(" ")[0]
            }, you're successfullty logged in!`,
            success: true,
          },
          expiresIn: 168,
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Incorrect Password!", success: false });
    }
  } catch (err) {
    res.status(500).json({
      message: "Login request is failed, please try again.",
      err,
      success: false,
    });
  }
};

// Passport middleware
const userAuth = passport.authenticate("jwt", { session: false });

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return !user ? true : false;
};

const validateCompany = async (uniqueId) => {
  let company = await Company.findOne({ uniqueId });
  return !company ? true : false;
};

// Genrate Auth token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_AUTH_TOKEN,
    { expiresIn: "7 days" }
  );
};

// Check Role middleware
const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json({ message: "Unauthorized" })
    : next();

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  superAdminRegister,
  userLogin,
  userAuth,
  checkRole,
  employeeRegister,
};