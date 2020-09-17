const Joi = require("joi");
const { GenreSchema } = require("./genre");
const mongoose = require("mongoose");


const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    numberInStock: {
      type: Number,
      min: 0,
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
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).max(10).required(),
    genreName: Joi.string().required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
