const { Genre, validate } = require("../models/genre");
const express = require("express");
const debug = require("debug")("app:genres");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.send(genres);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    return res.send(genre);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.find({ name: req.body.name });
    if (genre.length > 0) {
      return res
        .status(400)
        .send(`The genre with name ${req.body.name} already exists`);
    }

    const newGenre = new Genre({
      name: req.body.name,
    });
    const result = await newGenre.save();
    return res.send(result);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    const genreName = await Genre.find({ name: req.body.name });
    if (genreName.length > 0) {
      return res
        .status(400)
        .send(`The genre with name ${req.body.name} already exists`);
    }

    genre.name = req.body.name;
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete({ _id: req.params.id });
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

module.exports = router;
