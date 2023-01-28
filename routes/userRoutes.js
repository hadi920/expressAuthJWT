import express from "express";
import {
  changeUserPassword,
  resetPassword,
  sendResetPasswordEmail,
  userLogin,
  userRegistration,
} from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//User Router
const userRouter = express.Router();

//Middleware level protected routes
userRouter.use("/changepassword", checkUserAuth);

//Public Routes
userRouter.post("/signup", userRegistration);
userRouter.post("/login", userLogin);
userRouter.post("/forget-password", sendResetPasswordEmail);
userRouter.post("/reset-password/:id/:token", resetPassword);

//Private Routes
userRouter.post("/changepassword", changeUserPassword);

export default userRouter;
