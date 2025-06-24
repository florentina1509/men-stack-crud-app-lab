const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: String,
  leadCharacters: [String],
  airYear: Number,
  image: String,
  isCompleted: Boolean
});

const Series = mongoose.model('Series', seriesSchema);
module.exports = Series;
