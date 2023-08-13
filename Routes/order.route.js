const express = require("express");
const { User } = require("../model/user.model");
const { Restaurant } = require("../model/restaurant.model");
const { Order } = require("../model/order.model");

const orderRouter = express.Router();

orderRouter.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    return res
      .status(201)
      .json({ isError: false, msg: "new order added", neworder: order });
  } catch (error) {
    res.status(400).json({ isError: true, msg: error.message });
  }
});

orderRouter.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id })
      .populate("user")
      .populate("restaurant");
    // console.log(order);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// update order status
orderRouter.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const data = await Order.findById(id);
    if (!data) {
      return res.status(404).json({ msg: "Order not found" });
    }
    await Order.findByIdAndUpdate(id, { status: status });
    return res.status(200).json({
      error: false,
      message: "status update successfully",
      status,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = { orderRouter };
