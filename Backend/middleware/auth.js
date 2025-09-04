const { isVerifiedToken } = require("../utils/helper");
const { findUserByToken } = require("../api/web/model/userModel");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authentication;

    if (!token) {
      return res.status(401).json({
        status: false,
        response_code: 401,
        message: "No token provided",
        data: [],
      });
    }

    const isValid = await isVerifiedToken(token);

    if (!isValid) {
      return res.status(401).json({
        status: false,
        response_code: 401,
        message: "Invalid or expired token",
        data: [],
      });
    }

    const user = await findUserByToken(token);

    if (!user) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "User not found for the provided token",
        data: [],
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in authenticateToken middleware:", error);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

module.exports = authenticateToken;
