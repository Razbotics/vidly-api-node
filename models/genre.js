const Joi = require("joi");
const mongoose = require("mongoose");

const validGenres = ["Action", "Horror", "Comedy", "Drama", "Romance", "Sci-fi"];
const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: validGenres,
  },
});

const Genre = mongoose.model("Genre", GenreSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.GenreSchema = GenreSchema;
exports.validate = validateGenre;
