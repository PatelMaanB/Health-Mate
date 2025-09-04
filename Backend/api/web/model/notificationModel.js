const Notification = require("../schema/notificationSchema");

const addNotification = (data) => {
  return new Promise((resolve, reject) => {
    Notification.create(data)
      .then((createdNotif) => resolve(createdNotif))
      .catch((error) => {
        console.error("Error inserting Notification:", error);
        reject(error);
      });
  });
};

const findNotification = (query) => {
  return new Promise((resolve, reject) => {
    Notification.findOne(query)
      .then((notifData) => resolve(notifData))
      .catch((error) => {
        console.error("Error finding Notification:", error);
        reject(error);
      });
  });
};

const getAllNotifications = (query = {}) => {
  return new Promise((resolve, reject) => {
    Notification.find(query)
      .then((notifs) => resolve(notifs))
      .catch((error) => {
        console.error("Error fetching Notifications:", error);
        reject(error);
      });
  });
};

const deleteNotifications = (query) => {
  return new Promise((resolve, reject) => {
    Notification.deleteMany(query)
      .then((deleted) => resolve(deleted))
      .catch((error) => {
        console.error("Error deleting Notifications:", error);
        reject(error);
      });
  });
};

module.exports = {
  addNotification,
  findNotification,
  getAllNotifications,
  deleteNotifications,
};
