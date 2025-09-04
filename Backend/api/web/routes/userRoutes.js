const express = require("express");
const authenticateToken = require("../../../middleware/auth");
const userController = require("../controller/userController");
const saveBase64Image = require("../../../middleware/base64Image");
const userRouter = express.Router();

userRouter.get("/getuser", authenticateToken, userController.getUser);

userRouter.get(
  "/getallusers",
  authenticateToken,
  userController.getAllUserData
);

userRouter.post("/login", userController.userLogin);

userRouter.post("/register", saveBase64Image, userController.registerUser);

userRouter.put("/updateprofile", authenticateToken, userController.editUser);

userRouter.delete("/deleteuser", authenticateToken, userController.removeUser);

module.exports = userRouter;
