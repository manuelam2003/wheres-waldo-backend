const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  image: { type: String, required: true },
  user: { type: String, required: true },
  score: { type: Number, required: true },
});

module.exports = mongoose.model("Scores", ScoreSchema);
