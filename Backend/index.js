const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const userRouter = require("./api/web/routes/userRoutes");
const doctorRouter = require("./api/web/routes/doctorRoutes");
const appointRouter = require("./api/web/routes/appointRoutes");
const path = require("path");
const notificationRouter = require("./api/web/routes/notificationRouter");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/doctor", doctorRouter);
app.use("/appointment", appointRouter);
app.use("/notification", notificationRouter);
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {});
