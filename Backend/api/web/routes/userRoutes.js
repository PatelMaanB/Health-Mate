const express = require("express");
const auth = require("../../../middleware/auth");
const userController = require("../controller/userController");
const saveBase64Image = require("../../../middleware/base64Image");
const userRouter = express.Router();

userRouter.get("/getuser/:id", auth, userController.getuser);

userRouter.get("/getallusers", auth, userController.getallusers);

userRouter.post("/login", userController.login);

userRouter.post("/register", saveBase64Image, userController.register);

userRouter.put("/updateprofile", auth, userController.updateprofile);

userRouter.delete("/deleteuser", auth, userController.deleteuser);

module.exports = userRouter;
