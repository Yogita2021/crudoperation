const express = require("express");
const { User } = require("../model/user.model");
const { Restaurant } = require("../model/restaurant.model");
const { Order } = require("../model/order.model");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// require("dotenv").config();
const restaurantRouter = express.Router();

restaurantRouter.post("/restaurants", async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ msg: "resto added successfuly" });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

restaurantRouter.get("/restaurants", async (req, res) => {
  try {
    const resto = await Restaurant.find();
    if (resto.length == 0) {
      return res
        .status(400)
        .json({ isError: true, msg: "restorent is not present" });
    }
    res
      .status(201)
      .json({ isError: false, msg: "All restaurant are here", resto: resto });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

restaurantRouter.get("/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resto = await Restaurant.findById(id);
    if (!resto) {
      return res
        .status(400)
        .json({ isError: true, msg: "restorent is not present" });
    }
    res
      .status(201)
      .json({ isError: false, msg: "All restaurant are here", resto: resto });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

restaurantRouter.get("/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const resto = await Restaurant.findById(id);
    if (!resto) {
      return res
        .status(400)
        .json({ isError: true, msg: "restorent is not present" });
    }

    res.status(201).json({
      isError: false,
      msg: "Menu for perticular resot",
      menu: resto.menu,
    });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

restaurantRouter.put("/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const newMenu = req.body;
    const resto = await Restaurant.findById(id);

    if (!resto) {
      return res.status(400).json({ isError: true, msg: "resto not found" });
    }

    await Restaurant.findByIdAndUpdate(id, { $push: { menu: newMenu } });
    res
      .status(200)
      .json({ isError: false, msg: "newMwnu added", menu: newMenu });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

restaurantRouter.delete("/restaurants/:id/menu/:id2", async (req, res) => {
  try {
    const { id, id2 } = req.params;

    const resto = await Restaurant.findById(id);
    if (!resto) {
      return res.status(400).json({ msg: "resto not found" });
    }
    const deleteMenu = await Restaurant.findByIdAndDelete(id, {
      $pull: { menu: { _id: id2 } },
    });
    return res
      .status(202)
      .json({ isError: false, msg: "menu deleted successfully" });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

module.exports = { restaurantRouter };
