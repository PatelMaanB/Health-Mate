const { getAllNotifications } = require("../model/notificationModel");

const getAllNotifs = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "User ID is required",
        data: [],
      });
    }

    const notifs = await getAllNotifications({ userId: req.user._id });

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Notifications fetched successfully",
      data: notifs,
    });
  } catch (error) {
    console.error("Error in getAllNotifs:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Unable to get notifications",
      data: [],
    });
  }
};

module.exports = {
  getAllNotifs,
};
