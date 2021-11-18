const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Company = require("../models/companyModel");
const { cloudinary } = require("../utils/cloudinary");

// Super Admin Registration and COmpany Initialization
const superAdminRegister = async (userInfo, userImg, res) => {
  const {
    name,
    email,
    password,
    designation,
    companyName,
    companyUniqueId,
    companyJoiningPassword,
    role,
  } = userInfo;
  try {
    // upload image to cloudinary
    let profilePic;
    if (userImg) {
      profilePic = await cloudinary.uploader.upload(userImg.path);
    }

    // Validate email
    let isEmailAvailable = await validateEmail(email);
    if (!isEmailAvailable) {
      return res
        .status(400)
        .json({ message: "Email is already registered!", success: false });
    }

    // Validate Company Unique Id
    let isCompanyAvailable = await validateCompany(companyUniqueId);
    if (!isCompanyAvailable) {
      return res.status(400).json({
        message: "This company unique id is taken, please try something else.",
        success: false,
      });
    }

    // Create hash password
    const hashedUserPassword = await bcrypt.hash(password, 12);

    // Create Company hash password
    const hashedCompanyPassword = await bcrypt.hash(companyJoiningPassword, 12);

    // Add new User
    const newUser = new User({
      email,
      role,
      name,
      designation,
      url: profilePic?.url,
      publicId: profilePic?.public_id,
      password: hashedUserPassword,
    });
    const createdUser = await newUser.save();

    // Initialize new Firm
    const newCompany = new Company({
      companyName,
      uniqueId: companyUniqueId,
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
const employeeRegister = async (userInfo, userImg, res) => {
  try {
    // upload image to cloudinary
    let profilePic;
    if (userImg) {
      profilePic = await cloudinary.uploader.upload(userImg.path);
    } else {
    }

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
      url: profilePic?.url,
      publicId: profilePic?.public_id,
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
            profilePic: user.url,
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
            profilePic: user.url,
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

// Guest User Login
const guestUserLogin = async ({ desi }, res) => {
  function email() {
    if (desi === "superAdmin") {
      return "test1@test.com";
    }
    if (desi === "admin") {
      return "testadmin1@test.com";
    }
    if (desi === "employee") {
      return "testemp11@test.com";
    }
  }
  try {
    const user = await User.findOne({ email: email() });
    const userCompany = await Company.findById(user.companyId);
    res.status(200).send({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        designation: user.designation,
        companyId: user.companyId,
        profilePic: user.url,
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

module.exports = {
  superAdminRegister,
  userLogin,
  guestUserLogin,
  userAuth,
  checkRole,
  employeeRegister,
};
