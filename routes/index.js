const express = require("express");
const router = express.Router();
const Image = require("../models/image");

router.get("/", (req, res, next) => {
  res.json({ welcomeMessage: "Where is Waldo API" });
});

router.post("/images", async (req, res, next) => {
  try {
    const image = new Image({
      image: req.body.image,
      characters: req.body.characters,
      dimensions: req.body.dimensions,
    });
    const createdImage = await image.save();
    res.json({ createdImage });
  } catch (err) {
    return next(err);
  }
});

let startTime;
router.get("/images/:image", async (req, res, next) => {
  try {
    const image = await Image.findOne({ image: req.params.image });
    res.json({ image });
    startTime = Date.now();
  } catch (err) {
    return next(err);
  }
});

router.put("/images/:image", async (req, res, next) => {
  try {
    const image = await Image.findOne({ image: req.params.image });
    const newImage = new Image({
      image: req.body.image || image.image,
      characters: req.body.characters || image.characters,
      dimensions: req.body.dimensions || image.dimensions,
      _id: image._id,
    });
    const updatedImage = await Image.findOneAndUpdate(
      { image: req.params.image },
      newImage,
      { new: true }
    );
    res.json({ updatedImage });
  } catch (err) {
    return next(err);
  }
});

router.post("/game/finished", (req, res, next) => {
  try {
    const endTime = Date.now();
    const gameTime = endTime - startTime;
    const gameTimeInSeconds = gameTime / 1000;
    res.json({ gameTimeInSeconds });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
