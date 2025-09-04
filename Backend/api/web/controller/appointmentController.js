const {
  addAppointment,
  updateAppointment,
  getAllAppointments,
} = require("../model/appointmentModel");
const { addNotification } = require("../model/notificationModel");
const { findUser } = require("../model/userModel");

const getAllAppointmentsData = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { $or: [{ userId: req.query.search }, { doctorId: req.query.search }] }
      : {};

    const appointments = await getAllAppointments(keyword);

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error in getAllAppointmentsData:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to get appointments",
      data: [],
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { date, time, doctorId } = req.body;
    const userId = req.user._id;

    const appointmentData = { date, time, doctorId, userId };
    const appointment = await addAppointment(appointmentData);

    // User notification
    await addNotification({
      userId,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${date} ${time}`,
    });

    // Doctor notification
    const user = await findUser({ _id: userId });
    await addNotification({
      userId: doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${date} at ${time}`,
    });

    return res.status(201).json({
      status: true,
      response_code: 201,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to book appointment",
      data: [],
    });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { appointid, doctorId } = req.body;
    const userId = req.user._id;

    const updatedAppointment = await updateAppointment(
      { _id: appointid },
      { status: "Completed" }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "Appointment not found",
        data: [],
      });
    }

    // User notification
    await addNotification({
      userId,
      content: `Your appointment with Dr. ${req.body.doctorname} has been completed`,
    });

    // Doctor notification
    const user = await findUser({ _id: userId });
    await addNotification({
      userId: doctorId,
      content: `Your appointment with ${user.firstname} ${user.lastname} has been completed`,
    });

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Appointment marked as completed",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error in completeAppointment:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to complete appointment",
      data: [],
    });
  }
};

module.exports = {
  getAllAppointmentsData,
  bookAppointment,
  completeAppointment,
};
