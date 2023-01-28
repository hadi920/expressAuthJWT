import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await UserModel.findOne({ email: email });
  if (!userExist) {
    if (name && email && password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
          name: name,
          email: email,
          password: hashedPassword,
        });
        await newUser.save();
        res.json({
          status: "Successfull!!",
          message: "User registered successfully...",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json({
        status: "Failed",
        message: "All the fields are required",
      });
    }
  } else {
    res.json({
      status: "Failed",
      message: "User with this email already exists",
    });
  }
};

export const userLogin = async (req, res) => {
  let userExist;
  const { email, password } = req.body;
  if (email && password) {
    userExist = await UserModel.findOne({ email: email });
  }
  if (userExist) {
    try {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: userExist._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.json({
          status: "Success",
          user: userExist,
          token: token,
        });
      } else {
        res.json({
          status: "failed",
          message: "Username or Password is incorrect",
        });
      }
    } catch (error) {
      res.json({
        status: "failed",
        error: error,
      });
    }
  } else {
    res.json({
      status: "Failed",
      message: "User with this email does'nt exists",
    });
  }
};

export const changeUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.id;
  if (userId && oldPassword && newPassword) {
    try {
      const user = await UserModel.findById(userId);
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (isMatch) {
        const newSalt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, newSalt);
        await UserModel.updateOne(
          { _id: userId },
          {
            $set: {
              password: newHashedPassword,
            },
          }
        );
        res.json({
          status: "Success",
          message: "Password Changed",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Incorect Password",
        });
      }
    } catch (error) {
      res.json({
        status: "Failed",
        error: error,
      });
    }
  } else {
    res.json({
      status: "Failed",
      message: "All fields are required",
    });
  }
};

export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`;
      res.json({
        status: "Success",
        message: "Email has been sent to reset password",
        link: link,
      });
    } else {
      res.json({
        status: "Failed",
        message: "User with this email does not exist",
      });
    }
  } else {
    res.json({
      status: "Failed",
      message: "Email field is required",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  const new_secret = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        const newSalt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(password, newSalt);
        await UserModel.findByIdAndUpdate(user._id, {
          $set: {
            password: newHashedPassword,
          },
        });
        res.json({
          status: "Success",
          message: "Password resetted successfully...",
        });
      } else {
        res.json({
          status: "Failed",
          message: "Password does not match",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Both fields are required",
      });
    }
  } catch (error) {}
};
