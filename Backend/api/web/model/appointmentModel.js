const Appointment = require("../schema/appointmentSchema");

const addAppointment = (data) => {
  return new Promise((resolve, reject) => {
    Appointment.create(data)
      .then((createdAppointment) => resolve(createdAppointment))
      .catch((error) => {
        console.error("Error inserting Appointment:", error);
        reject(error);
      });
  });
};

const findAppointment = (query) => {
  return new Promise((resolve, reject) => {
    Appointment.findOne(query)
      .then((appointmentData) => resolve(appointmentData))
      .catch((error) => {
        console.error("Error finding Appointment:", error);
        reject(error);
      });
  });
};

const updateAppointment = (query, data) => {
  return new Promise((resolve, reject) => {
    Appointment.findOneAndUpdate(query, data, { new: true })
      .then((updatedAppointment) => resolve(updatedAppointment))
      .catch((error) => {
        console.error("Error updating Appointment:", error);
        reject(error);
      });
  });
};

const getAllAppointments = (query = {}) => {
  return new Promise((resolve, reject) => {
    Appointment.find(query)
      .then((appointmentsData) => resolve(appointmentsData))
      .catch((error) => {
        console.error("Error fetching Appointments:", error);
        reject(error);
      });
  });
};

const deleteAppointment = (query) => {
  return new Promise((resolve, reject) => {
    Appointment.deleteMany(query)
      .then((deleted) => resolve(deleted))
      .catch((error) => {
        console.error("Error deleting Appointment:", error);
        reject(error);
      });
  });
};

module.exports = {
  addAppointment,
  findAppointment,
  updateAppointment,
  getAllAppointments,
  deleteAppointment,
};
