const express = require("express");
const router = express.Router();
const Score = require("../models/score");
const { body, validationResult } = require("express-validator");

router.get("/", async (req, res, next) => {
  try {
    const scores = await Score.find().sort({ score: 1 }).exec();
    res.json({ scores });
  } catch (err) {
    return next(err);
  }
});

router.get("/:game", async (req, res, next) => {
  try {
    const scores = await Score.find({ image: req.params.game })
      .sort({ score: 1 })
      .exec();
    res.json({ scores });
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/submit",
  [
    body("image", "Image must not be empty.").trim().isLength({ min: 1 }),
    body("user", "User must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .blacklist("<>&/"),
    body("score", "Score must not be empty.").trim().isLength({ min: 1 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const score = new Score({
        image: req.body.image,
        user: req.body.user,
        score: req.body.score,
      });

      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        await score.save();
        res.json({ message: "Score submitted" });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
