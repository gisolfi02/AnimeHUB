const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");

router.get("/", animeController.getAllAnime);
router.post("/", animeController.createAnime);
router.put("/:id", animeController.updateAnime);
router.delete("/:id", animeController.deleteAnime);
router.get("/search", animeController.searchAnimeByName);

module.exports = router;
