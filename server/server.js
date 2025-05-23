const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const animeRoutes = require("./routes/animeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/anime", animeRoutes);
app.use("/api/review", reviewRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connesso a MongoDB"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server attivo su porta ${PORT}`));
