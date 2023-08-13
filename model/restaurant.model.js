const mongoose = require("mongoose");

const resaturantSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  menu: [
    {
      name: String,
      description: String,
      price: Number,
      image: String,
    },
  ],
});

const Restaurant = mongoose.model("restaurant", resaturantSchema);

module.exports = { Restaurant };
