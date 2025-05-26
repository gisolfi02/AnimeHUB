const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/", reviewController.getAllReviews);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.get("/full", reviewController.getFullReviewInfo);
router.get("/search", reviewController.searchReviewByAnimeID);
router.get("/check", reviewController.checkReviewByAnimeAndUserID);

module.exports = router;
