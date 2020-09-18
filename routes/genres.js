const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
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

router.post("/", [auth, admin], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
      name: req.body.name,
    });

    await genre.save();
    return res.send(genre);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    genre.name = req.body.name;
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
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
