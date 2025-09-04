const express = require("express");
const authenticateToken = require("../../../middleware/auth");
const notificationController = require("../controller/notificationController");

const notificationRouter = express.Router();

notificationRouter.get(
  "/getallnotifs",
  authenticateToken,
  notificationController.getAllNotifs
);

module.exports = notificationRouter;
