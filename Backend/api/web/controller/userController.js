const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../schema/doctorSchema");
const Appointment = require("../schema/appointmentSchema");
const isVerifiedToken = require("../../../utils/helper");
const {
  addUser,
  findUser,
  updateUser,
  getAllUser,
  deleteUser,
} = require("../model/userModel");

const getUser = async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "User Id is required",
        data: [],
      });
    }

    const user = await findUser({ _id: id, is_deleted: false });
    if (!user) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "User not found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "User found successfully",
      data: mapUserResponse(user),
    });
  } catch (err) {
    console.error("Error in getUser:", err);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "An error occurred while fetching user",
      data: [],
    });
  }
};

const getAllUserData = async (req, res) => {
  try {
    const users = await getAllUser();
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "No users found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error in getAllUserData:", err);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "An error occurred while fetching users",
      data: [],
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUser({ email, is_deleted: false });
    if (!user) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "User not found",
        data: [],
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: false,
        response_code: 401,
        message: "Password does not match",
        data: [],
      });
    }

    // If token already exists & valid
    if (user.token) {
      const isVerified = await isVerifiedToken(user.token);
      if (isVerified) {
        return res.status(200).json({
          status: true,
          response_code: 200,
          message: "User logged in successfully",
          data: user,
        });
      }
    }

    // Generate new token
    const token = jwt.sign(
      { _id: user._id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const updatedUser = await updateUser(
      { _id: user._id, is_deleted: false },
      { token }
    );

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "User logged in successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error in userLogin:", err);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Error in userLogin",
      data: [],
    });
  }
};

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const imagePath = req.imagePath || undefined;

  try {
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "Firstname, lastname, email and password are required",
        data: [],
      });
    }

    const existingUser = await findUser({ email, is_deleted: false });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        response_code: 400,
        message: "Email already exists",
        data: [],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      password: hashedPassword,
      imagePath: imagePath || undefined,
    };

    const newUser = await addUser(newUserData);

    if (!newUser) {
      return res.status(500).json({
        status: false,
        response_code: 500,
        message: "Failed to create user profile",
        data: [],
      });
    }

    return res.status(201).json({
      status: true,
      response_code: 201,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "An error occurred while registering the user",
      data: [],
    });
  }
};

const editUser = async (req, res) => {
  const reqData = req.body;
  const user = req.user;

  try {
    const updatedUser = await updateUser(
      { _id: user._id, is_deleted: false },
      {
        firstname: reqData.firstname || user.firstname,
        lastname: reqData.lastname || user.lastname,
        email: reqData.email || user.email,
        age: reqData.age || user.age,
        gender: reqData.gender || user.gender,
        mobile: reqData.mobile || user.mobile,
        address: reqData.address || user.address,
        password: reqData.password
          ? await bcrypt.hash(reqData.password, 10)
          : user.password,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "User not found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error in editUser:", err);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

const removeUser = async (req, res) => {
  const user = req.user;
  try {
    const deletedUser = await deleteUser(user._id);

    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        response_code: 404,
        message: "User not found",
        data: [],
      });
    }

    // Remove related doctor and appointment
    await Doctor.findOneAndDelete({ userId: user._id });
    await Appointment.deleteMany({ userId: user._id });

    return res.status(200).json({
      status: true,
      response_code: 200,
      message: "User and related data deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    console.error("Error in removeUser:", err);
    return res.status(500).json({
      status: false,
      response_code: 500,
      message: "An error occurred while deleting user",
      data: [],
    });
  }
};

module.exports = {
  getUser,
  getAllUserData,
  userLogin,
  registerUser,
  editUser,
  removeUser,
};
