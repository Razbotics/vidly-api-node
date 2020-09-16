const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const debug = require("debug")("app:movies");

const router = express.Router();

const GenreSchema = new mongoose.Schema({
  name: String,
});

const MovieSchema = new mongoose.Schema({
  title: String,
  numberInStock: Number,
  dailyRentalRate: Number,
  genre: GenreSchema,
});

const Movie = mongoose.model("Movie", MovieSchema);

async function createMovie() {
  const movie = new Movie({
    title: "Terminator",
    numberInStock: 10,
    dailyRentalRate: 8,
    genre: { name: "Action" },
  });

  const result = await movie.save();
  console.log(result);
}

async function getMovies() {
  const movies = await Movie.find({ "genre.name": "Romance" })
    .sort("numberInStock")
    .limit(10);

  debug(movies);
}

async function updateMovie(id) {
  const movie = await Movie.findById(id);
  if (!movie) return;
  (movie.numberInStock = 5), (movie.dailyRentalRate = 5);
  const result = await movie.save();
  console.log(result);
}

async function updateMovie_(id) {
  const result = await Movie.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        numberInStock: 10,
      },
      $inc: {
        dailyRentalRate: -1,
      },
    },
    { new: true, useFindAndModify: false }
  );
  debug(result);
}

async function removeMovie(id) {
  const result = await Movie.deleteOne({ _id: id });
  debug(result);
}

// removeMovie("5f62752f89c8981554177ac4");
updateMovie_("5f5c7e995744713145f3c940");
// getMovies();
// createMovie();

const movies = [];

router.get("/", (req, res) => {
  res.send(movies);
});

router.post("/", (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = {
    id: movies.length + 1,
    name: req.body.name,
  };
  movies.push(movie);
  res.send(movie);
});

router.put("/:id", (req, res) => {
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  movie.name = req.body.name;
  res.send(movie);
});

router.delete("/:id", (req, res) => {
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  res.send(movie);
});

router.get("/:id", (req, res) => {
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");
  res.send(movie);
});

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).max(10).required(),
    genreId: Joi.string().required(),
  };

  return Joi.validate(movie, schema);
}

module.exports = router;
