const express = require("express");
const { User } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userRouter = express.Router();

// register route

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already registered!!" });
    }
    const hash = bcrypt.hashSync(password, 8);

    const newuser = new User({ name, email, password: hash, address });
    await newuser.save();
    res.status(201).json({
      isError: false,
      msg: "User registered successfuly",
      newuser: newuser,
    });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

// loginRoute

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not registered" });
    }

    const passcheck = bcrypt.compareSync(password, user.password);
    if (!passcheck) {
      return res.status(400).json({ msg: "wrong credential!!" });
    }
    const payload = { userID: user._id, username: user.name };
    const token = jwt.sign(payload, process.env.secreate_key, {
      expiresIn: "8h",
    });

    res.status(201).json({
      isError: false,
      msg: "User login successfuly",
      user: user,
      token,
    });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

// reset route

userRouter.patch("/user/reset/:id", async (req, res) => {
  try {
    const { newpassword, oldpassword } = req.body;

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "User not found!!" });
    }

    const { password } = user;

    const isPass = bcrypt.compareSync(oldpassword, password);
    console.log(isPass);
    if (!isPass) {
      res.status(400).json({ msg: "Wrong password" });
    } else {
      const hash = bcrypt.hashSync(newpassword, 8);

      await User.findByIdAndUpdate(id, { password: hash });

      res
        .status(200)
        .send({ isError: false, message: "password reset successfuly" });
    }
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

module.exports = { userRouter };
