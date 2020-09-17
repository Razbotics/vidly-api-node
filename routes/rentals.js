const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const express = require("express");
const debug = require("debug")("app:rentals");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    return res.send(rentals);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer)
      return res.status(400).send("Customer with given Id not found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie with given Id not found");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock");

    const rental = new rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    const result = await rental.save();
    movie.numberInStock--;
    await movie.save();

    return res.send(result);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});
