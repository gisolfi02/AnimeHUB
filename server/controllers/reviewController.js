const Review = require("../models/Review");

exports.getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || "";
    const sortOrder = parseInt(req.query.sortOrder) || 1;

    const reviews = await Review.find().skip(skip).limit(limit).sort({ [sortField]: sortOrder });
    const total = await Review.countDocuments();

    res.json({
      data: reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Errore", error: err.message });
  }
};

exports.createReview = async (req, res) => {
  const newReview = new Review(req.body);
  await newReview.save();
  res.status(201).json(newReview);
};

exports.updateReview = async (req, res) => {
  const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "Review eliminata" });
};

exports.getFullReviewInfo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || "";
    const sortOrder = parseInt(req.query.sortOrder) || 1;

    const ids = await Review
      .find({})
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('_id');
    const idList = ids.map(r => r._id);

    const pipeline = [
      { $match: { _id: { $in: idList } } },
      {
        $lookup: {
          from: "Anime",
          localField: "anime_id",
          foreignField: "MAL_ID",
          as: "anime"
        }
      },
      { $unwind: "$anime" },
      {
        $lookup: {
          from: "WatchingStatus",
          localField: "watching_status",
          foreignField: "status",
          as: "status"
        }
      },
      { $unwind: "$status" },
      {
        $project: {
          _id: 1,
          anime_id: 1,
          user_id: 1,
          rating: 1,
          anime_name: "$anime.Name",
          genres: "$anime.Genres",
          episodes: "$anime.Episodes",
          studios: "$anime.Studios",
          status_description: "$status.description"
        }
      }
    ];
    const result = await Review.aggregate(pipeline);
    const total = await Review.countDocuments();

    res.json({
      data: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Errore JOIN:", err.message);
    res.status(500).json({ message: "Errore JOIN", error: err.message });
  }
};


exports.searchReviewByAnimeID = async (req, res) => {
  try {
      const query = req.query.q || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;
      const sortField = req.query.sortField || "";
      const sortOrder = parseInt(req.query.sortOrder) || 1;
  
      const filter = query && !isNaN(Number(query))
      ? { anime_id: Number(query) }
      : {};
  
      const result = await Review.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder });
  
      const total = await Review.countDocuments(filter);
  
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


exports.checkReviewByAnimeAndUserID = async (req, res) => {
  try {
    const anime_id = parseInt(req.query.anime_id);
    const user_id = parseInt(req.query.user_id);
    const exists = await Review.exists({ anime_id: anime_id, user_id: user_id });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Errore controllo review", error: err.message });
  }
};