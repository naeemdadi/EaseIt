const express = require("express");
const { connect } = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { success, error } = require("consola");
const userRouter = require("./routes/userRouter");
const companyRouter = require("./routes/companyRouter");
const taskRouter = require("./routes/taskRouter");
const messageRouter = require("./routes/messageRouter");
const passport = require("passport");

// configs
dotenv.config();

// Initializing the App
const app = express();

// Set up a whitelist and check against it:
var allowlist = ["https://easeit.netlify.app"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// Middlewares
app.use(cors(corsOptionsDelegate));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// in latest body-parser use like below.
app.use(passport.initialize());

require("./middlewares/passport")(passport);

// Routers
app.use("/api/users", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/messages", messageRouter);

app.use("/uploads", express.static("uploads"));

// Server route
app.get("/", (req, res) => {
  res.send("Server Started");
});

// Start App
const start = async () => {
  // Connecting with mongodb database
  try {
    await connect(process.env.MONGODB_URL || "mongodb://localhost/EaseIt", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    success({ message: `Connected with database`, badge: true });

    const port = process.env.PORT || 5000;

    // Start a Server
    const server = app.listen(port, () =>
      success({ message: `Server started on port:${port}`, badge: true })
    );
    const io = require("socket.io")(server);
    io.set("origins", "*:*");

    let users = [];

    const addUser = (id, userId, room) => {
      const user = { id, userId, room };
      users.push(user);
      return { user };
    };

    const getUser = (userId) => {
      let user = users.find((user) => user.userId === userId);
      return user;
    };

    io.on("connection", (socket) => {
      // Get user and add it to the room
      socket.on("addUser", ({ userId, room }) => {
        const { user } = addUser(socket.id, userId, room);
        socket.join(user.room);
      });

      // Create Room name
      socket.on("sendMessage", ({ message, userId }) => {
        const user = getUser(userId);
        socket.to(user?.room).broadcast.emit("getMessage", {
          senderId: user?.userId,
          text: message,
        });
      });
    });
  } catch (err) {
    error({
      message: `Unable to connect with database \n${err}`,
      badge: false,
    });
    // Try again if error exists
    start();
  }
};

start();
