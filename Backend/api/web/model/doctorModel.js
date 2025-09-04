const Doctor = require("../schema/doctorSchema");

const addDoctor = (data) => {
  return new Promise((resolve, reject) => {
    Doctor.create(data)
      .then((createdDoctor) => resolve(createdDoctor))
      .catch((error) => {
        console.error("Error inserting Doctor:", error);
        reject(error);
      });
  });
};

const findDoctor = (query) => {
  return new Promise((resolve, reject) => {
    Doctor.findOne(query)
      .then((doctorData) => resolve(doctorData))
      .catch((error) => {
        console.error("Error finding Doctor:", error);
        reject(error);
      });
  });
};

const updateDoctor = (query, data) => {
  return new Promise((resolve, reject) => {
    Doctor.findOneAndUpdate(query, data, { new: true })
      .then((updatedDoctor) => resolve(updatedDoctor))
      .catch((error) => {
        console.error("Error updating Doctor:", error);
        reject(error);
      });
  });
};

const getAllDoctors = (query = {}, populateField = null) => {
  return new Promise((resolve, reject) => {
    let q = Doctor.find(query);
    if (populateField) {
      q = q.populate(populateField);
    }
    q.then((doctorsData) => resolve(doctorsData)).catch((error) => {
      console.error("Error fetching Doctors:", error);
      reject(error);
    });
  });
};

const deleteDoctor = (query) => {
  return new Promise((resolve, reject) => {
    Doctor.findOneAndDelete(query)
      .then((deletedDoctor) => resolve(deletedDoctor))
      .catch((error) => {
        console.error("Error deleting Doctor:", error);
        reject(error);
      });
  });
};

module.exports = {
  addDoctor,
  findDoctor,
  updateDoctor,
  getAllDoctors,
  deleteDoctor,
};
