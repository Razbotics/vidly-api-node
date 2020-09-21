const Joi = require("joi");
const { GenreSchema } = require("./genre");
const mongoose = require("mongoose");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    numberInStock: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    genre: {
      type: GenreSchema,
      required: true,
    },
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).max(200).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(10).required(),
    genreId: Joi.objectId().required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
