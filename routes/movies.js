const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const debug = require("debug")("app:movies");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.send(movies);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    return res.send(movie);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.find({ name: req.body.genreName });
    if (genre.length === 0)
      return res.status(404).send(`${req.body.genreName} is not a valid Genre`);

    const newMovie = new Movie({
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: genre[0],
    });

    const result = await newMovie.save();
    return res.send(result);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.find({ name: req.body.genreName });
    if (genre.length === 0)
      return res.status(404).send(`${req.body.genreName} is not a valid Genre`);

    const movie = await Movie.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
          genre: genre[0],
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    return res.send(movie);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete({ _id: req.params.id });
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

module.exports = router;
