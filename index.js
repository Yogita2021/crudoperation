const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const app = express();

const { userRouter } = require("./Routes/user.route");
const { restaurantRouter } = require("./Routes/restaurant.route");
app.get("/", (req, res) => {
  res.send("Hello I am server");
});
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", restaurantRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db at port 8000");
  } catch (error) {
    console.log(error);
    console.log("Not connected to db");
  }
});
