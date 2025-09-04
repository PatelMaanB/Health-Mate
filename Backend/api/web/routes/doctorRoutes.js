const express = require("express");
const doctorController = require("../controller/doctorController");
const authenticateToken = require("../../../middleware/auth");

const doctorRouter = express.Router();

doctorRouter.get("/getalldoctors", doctorController.getAllDoctorsData);

doctorRouter.get(
  "/getnotdoctors",
  authenticateToken,
  doctorController.getNonDoctors
);

doctorRouter.post(
  "/applyfordoctor",
  authenticateToken,
  doctorController.applyForDoctor
);

doctorRouter.put(
  "/deletedoctor",
  authenticateToken,
  doctorController.removeDoctor
);

doctorRouter.put(
  "/acceptdoctor",
  authenticateToken,
  doctorController.acceptDoctor
);

doctorRouter.put(
  "/rejectdoctor",
  authenticateToken,
  doctorController.rejectDoctor
);

module.exports = doctorRouter;
