const User = require("../schema/userSchema");

const addUser = (data) => {
  return new Promise((resolve, reject) => {
    User.create(data)
      .then((createdUser) => resolve(createdUser))
      .catch((error) => {
        console.error("Error inserting User:", error);
        reject(error);
      });
  });
};

const findUser = (data) => {
  return new Promise((resolve, reject) => {
    User.findOne(data)
      .then((userData) => resolve(userData))
      .catch((error) => {
        console.error("Error finding User:", error);
        reject(error);
      });
  });
};

const updateUser = (query, data) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(query, data, { new: true })
      .then((updatedUser) => resolve(updatedUser))
      .catch((error) => {
        console.error("Error updating User:", error);
        reject(error);
      });
  });
};

const findUserByToken = async (token) => {
  try {
    return await User.findOne({ token });
  } catch (err) {
    console.error("Error in findUserByToken:", err);
    return null;
  }
};

const getAllUser = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .then((usersData) => resolve(usersData))
      .catch((error) => {
        console.error("Error in finding Users:", error);
        reject(error);
      });
  });
};

const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndDelete(userId)
      .then((deletedUser) => resolve(deletedUser))
      .catch((error) => {
        console.error("Error deleting User:", error);
        reject(error);
      });
  });
};

module.exports = {
  addUser,
  findUser,
  updateUser,
  getAllUser,
  deleteUser,
  findUserByToken,
};
