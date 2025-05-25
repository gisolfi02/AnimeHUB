const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");

router.get("/", animeController.getAllAnime);
router.post("/", animeController.createAnime);
router.put("/:id", animeController.updateAnime);
router.delete("/:id", animeController.deleteAnime);
router.get("/search", animeController.searchAnimeByName);
router.get("/ratings", animeController.getDistinctRatings);
router.get("/check-id/:malId", animeController.checkAnimeIdExists);
router.get("/genres", animeController.getDistinctGenres);
router.get("/producers", animeController.getDistinctProducers);
router.get("/studios", animeController.getDistinctStudios);


module.exports = router;
