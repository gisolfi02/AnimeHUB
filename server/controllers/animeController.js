const Anime = require("../models/Anime");

exports.getAllAnime = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const anime = await Anime.find().skip(skip).limit(limit);
    const total = await Anime.countDocuments();

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

    const filter = query
      ? { Name: { $regex: query, $options: "i" } }
      : {};

    const result = await Anime.find(filter)
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
