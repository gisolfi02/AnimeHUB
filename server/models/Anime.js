// server/models/Anime.js
const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  MAL_ID: Number,
  Name: String,
  Score: Number,
  Genres: String,
  Episodes: Number,
  Aired: String,
  Producers: String,
  Studios: String,
  Rating: String,
  Ranked: Number
});

module.exports = mongoose.model("Anime", AnimeSchema, "Anime");
