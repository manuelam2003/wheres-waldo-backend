const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  image: { type: String, required: true },
  characters: [
    {
      character: { type: String, required: true },
      minX: { type: Number, required: true },
      maxX: { type: Number, required: true },
      minY: { type: Number, required: true },
      maxY: { type: Number, required: true },
    },
  ],
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Images", ImageSchema);
