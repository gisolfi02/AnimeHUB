const Anime = require("../models/Anime");

exports.getAllAnime = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || "";
    const sortOrder = parseInt(req.query.sortOrder) || 1;

    const filter = {};
    if (req.query["genres[]"]) {
      const genres = Array.isArray(req.query["genres[]"]) ? req.query["genres[]"] : [req.query["genres[]"]];
      filter.$and = genres.map(g => ({
        Genres: { $regex: new RegExp(`(^|,\\s*)${g}(,|$)`, "i") }
      }));
    }
    if (req.query.producer) filter.Producers = { $regex: new RegExp(`(^|,\\s*)${req.query.producer}(,|$)`, "i") };
    if (req.query.studio) filter.Studios = { $regex: new RegExp(`(^|,\\s*)${req.query.studio}(,|$)`, "i") };
    if (req.query["ratings[]"]) {
      const ratings = Array.isArray(req.query["ratings[]"]) ? req.query["ratings[]"] : [req.query["ratings[]"]];
      filter.Rating = { $in: ratings };
    }

    const anime = await Anime.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    const total = await Anime.countDocuments(filter);

    res.json({
      data: anime,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Errore", error: err.message });
  }
};

exports.createAnime = async (req, res) => {
  const newAnime = new Anime(req.body);
  await newAnime.save();
  res.status(201).json(newAnime);
};

exports.updateAnime = async (req, res) => {
  const updated = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteAnime = async (req, res) => {
  await Anime.findByIdAndDelete(req.params.id);
  res.json({ message: "Anime eliminato" });
};

exports.searchAnimeByName = async (req, res) => {
  try {
    const query = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || "";
    const sortOrder = parseInt(req.query.sortOrder) || 1;

    const filter = query
      ? { Name: { $regex: query, $options: "i" } }
      : {};

    if (req.query["genres[]"]) {
      const genres = Array.isArray(req.query["genres[]"]) ? req.query["genres[]"] : [req.query["genres[]"]];
      filter.$and = genres.map(g => ({
        Genres: { $regex: new RegExp(`(^|,\\s*)${g}(,|$)`, "i") }
      }));
    }
    if (req.query.producer) filter.Producers = { $regex: new RegExp(`(^|,\\s*)${req.query.producer}(,|$)`, "i") };
    if (req.query.studio) filter.Studios = { $regex: new RegExp(`(^|,\\s*)${req.query.studio}(,|$)`, "i") };
    if (req.query["ratings[]"]) {
      const ratings = Array.isArray(req.query["ratings[]"]) ? req.query["ratings[]"] : [req.query["ratings[]"]];
      filter.Rating = { $in: ratings };
    }

    const result = await Anime.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Anime.countDocuments(filter);

    res.json({
      data: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (err) {
    res.status(500).json({ message: "Errore ricerca", error: err.message });
  }
};

exports.getDistinctRatings = async (req, res) => {
  try {
    const ratings = await Anime.distinct("Rating", { Rating: { $ne: null, $ne: "" } });
    res.json(ratings.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: "Errore recupero rating", error: err.message });
  }
};

exports.checkAnimeIdExists = async (req, res) => {
  try {
    const malId = parseInt(req.params.malId);
    const exists = await Anime.exists({ MAL_ID: malId });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Errore controllo MAL_ID", error: err.message });
  }
};

exports.checkAnimeRatingExists = async (req, res) => {
  try {
    const rating = parseInt(req.params.rating);
    const exists = await Anime.exists({ Rating: rating });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Errore controllo rating", error: err.message });
  }
};


exports.getDistinctGenres = async (req, res) => {
  try {
    const genresRaw = await Anime.distinct("Genres", { Genres: { $ne: null, $ne: "" } });
    const genresArr = genresRaw.flatMap(g =>
      Array.isArray(g)
        ? g
        : typeof g === "string"
        ? g.split(",").map(s => s.trim())
        : []
    );
    const uniqueGenres = [...new Set(genresArr.filter(Boolean))].sort();
    res.json(uniqueGenres);
  } catch (err) {
    res.status(500).json({ message: "Errore recupero generi", error: err.message });
  }
};

exports.getDistinctProducers = async (req, res) => {
  try {
    const producersRaw = await Anime.distinct("Producers", { Producers: { $ne: null, $ne: "" } });
    const producersArr = producersRaw.flatMap(p =>
      Array.isArray(p)
        ? p
        : typeof p === "string"
        ? p.split(",").map(s => s.trim())
        : []
    );
    const uniqueProducers = [...new Set(producersArr.filter(Boolean))].sort();
    res.json(uniqueProducers);
  } catch (err) {
    res.status(500).json({ message: "Errore recupero produttori", error: err.message });
  }
};

exports.getDistinctStudios = async (req, res) => {
  try {
    const studiosRaw = await Anime.distinct("Studios", { Studios: { $ne: null, $ne: "" } });
    const studiosArr = studiosRaw.flatMap(s =>
      Array.isArray(s)
        ? s
        : typeof s === "string"
        ? s.split(",").map(str => str.trim())
        : []
    );
    const uniqueStudios = [...new Set(studiosArr.filter(Boolean))].sort();
    res.json(uniqueStudios);
  } catch (err) {
    res.status(500).json({ message: "Errore recupero studios", error: err.message });
  }
};