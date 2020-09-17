const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      enum: ["Action", "Horror", "Comedy", "Drama", "Romance"],
    },
  })
);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
