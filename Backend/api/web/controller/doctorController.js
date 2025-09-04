const {
  addDoctor,
  findDoctor,
  updateDoctor,
  getAllDoctors,
  deleteDoctor,
} = require("../model/doctorModel");
const { updateUser } = require("../model/userModel");
const addNotification = require("../model/notificationModel");
const deleteAppointment = require("../model/appointmentModel");

const getAllDoctorsData = async (req, res) => {
  try {
    let doctors;
    if (!req.user || !req.user._id) {
      doctors = await getAllDoctors({ isDoctor: true }, "userId");
    } else {
      doctors = await getAllDoctors(
        { isDoctor: true, _id: { $ne: req.user._id } },
        "userId"
      );
    }

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getAllDoctorsData:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to get doctors",
      data: [],
    });
  }
};

const getNonDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctors(
      { isDoctor: false, _id: { $ne: req.user._id } },
      "userId"
    );

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Non-doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getNonDoctors:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to get non-doctors",
      data: [],
    });
  }
};

const applyForDoctor = async (req, res) => {
  try {
    const alreadyFound = await findDoctor({ userId: req.user._id });
    if (alreadyFound) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "Application already exists",
        data: [],
      });
    }

    const doctorData = { ...req.body.formDetails, userId: req.user._id };
    const doctor = await addDoctor(doctorData);

    return res.status(201).json({
      status: true,
      response_code: 201,
      message: "Application submitted successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in applyForDoctor:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to submit application",
      data: [],
    });
  }
};

const acceptDoctor = async (req, res) => {
  try {
    const updatedUser = await updateUser(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" }
    );

    const updatedDoctor = await updateDoctor(
      { userId: req.body.id },
      { isDoctor: true }
    );

    await addNotification({
      userId: req.body.id,
      content: "Congratulations, Your application has been accepted.",
    });

    return res.status(201).json({
      status: true,
      response_code: 201,
      message: "Application accepted and notification sent",
      data: { updatedUser, updatedDoctor },
    });
  } catch (error) {
    console.error("Error in acceptDoctor:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Error while sending acceptance notification",
      data: [],
    });
  }
};

const rejectDoctor = async (req, res) => {
  try {
    const updatedUser = await updateUser(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" }
    );

    const deletedDoctor = await deleteDoctor({ userId: req.body.id });

    await addNotification({
      userId: req.body.id,
      content: "Sorry, Your application has been rejected.",
    });

    return res.status(201).json({
      status: true,
      response_code: 201,
      message: "Application rejected and notification sent",
      data: { updatedUser, deletedDoctor },
    });
  } catch (error) {
    console.error("Error in rejectDoctor:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Error while rejecting application",
      data: [],
    });
  }
};

const removeDoctor = async (req, res) => {
  try {
    const updatedUser = await updateUser(
      { _id: req.body.userId },
      { isDoctor: false }
    );
    const deletedDoctor = await deleteDoctor({ userId: req.body.userId });
    await deleteAppointment({ userId: req.body.userId });

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Doctor and related appointments deleted successfully",
      data: { updatedUser, deletedDoctor },
    });
  } catch (error) {
    console.error("Error in removeDoctor:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to delete doctor",
      data: [],
    });
  }
};

module.exports = {
  getAllDoctorsData,
  getNonDoctors,
  applyForDoctor,
  acceptDoctor,
  rejectDoctor,
  removeDoctor,
};
