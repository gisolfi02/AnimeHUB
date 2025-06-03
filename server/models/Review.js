const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user_id: Number,
  anime_id: Number,
  rating: Number,
  watching_status: Number,
  watched_episodes: Number
});

module.exports = mongoose.model("Review", ReviewSchema, "Review");
