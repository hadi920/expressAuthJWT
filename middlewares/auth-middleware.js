import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const checkUserAuth = async (req, res, next) => {
  let token;
  var bearerToken = req.headers["authorization"];

  if (bearerToken && bearerToken.startsWith("Bearer")) {
    try {
      token = bearerToken.split(" ")[1];
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.id = userId;
      next();
    } catch (error) {
      res.json({
        status: "Failed",
        message: "Unauthorized User",
      });
    }
  } else {
    res.json({
      status: "Failed",
      message: "No token Found",
    });
  }
};

export default checkUserAuth;
