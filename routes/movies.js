const asyncMiddleware = require("../middleware/async");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const express = require("express");
const debug = require("debug")("app:movies");

const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const movies = await Movie.find();
    return res.send(movies);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    return res.send(movie);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid genre Id");

    debug(genre);
    const movie = new Movie({
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });

    await movie.save();
    return res.send(movie);
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid genre Id");

    const movie = await Movie.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
          genre: {
            _id: genre._id,
            name: genre.name,
          },
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    return res.send(movie);
  })
);

router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndDelete({ _id: req.params.id });
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
  })
);

module.exports = router;
