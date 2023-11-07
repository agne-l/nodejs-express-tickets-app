import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const SIGNUP = async (req, res) => {
  try {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const email = req.body.email;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    let name = req.body.name;

    if (name.length > 0 && name[0] === name[0].toLowerCase()) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    let password = req.body.password;

    if (password.length < 6 || !/\d/.test(password)) {
      return res.status(400).json({
        message:
          "The password must consist of at least six characters and contain at least one digit.",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new UserModel({
      name,
      email,
      password: hash,
      bought_tickets: req.body.bought_tickets,
      money_balance: req.body.money_balance,
    });

    user.id = user._id;

    const response = await user.save();

    return res.status(200).json({ message: "User was signed up", response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const LOGIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
      // { algorithm: "RS256" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, userId: user._id },
      // eslint-disable-next-line no-undef
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return res
      .status(200)
      .json({ message: "Login was successful", token, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GET_NEW_TOKEN = async (req, res) => {
  const user = await UserModel.findOne({ id: req.body.userId });
  console.log(user);
  const refreshToken = req.headers.authorization;
  const newJwtToken = jwt.sign(
    { email: user.email, userId: user._id },
    // eslint-disable-next-line no-undef
    process.env.NEW_JWT_SECRET
  );

  return res.status(200).json({ refreshToken, newJwtToken });
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ name: "asc" });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "user's_tickets",
        },
      },
    ]);

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const user = await UserModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "user's_tickets",
        },
      },
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export {
  SIGNUP,
  LOGIN,
  GET_NEW_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
};
