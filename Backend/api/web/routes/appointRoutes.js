const express = require("express");
const authenticateToken = require("../../../middleware/auth");
const appointmentController = require("../controller/appointmentController");

const appointRouter = express.Router();

appointRouter.get(
  "/getallappointments",
  authenticateToken,
  appointmentController.getAllAppointmentsData
);

appointRouter.post(
  "/bookappointment",
  authenticateToken,
  appointmentController.bookAppointment
);

appointRouter.put(
  "/completed",
  authenticateToken,
  appointmentController.completeAppointment
);

module.exports = appointRouter;
