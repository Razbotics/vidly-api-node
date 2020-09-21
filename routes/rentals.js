const asyncMiddleware = require("../middleware/async");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");
const express = require("express");
const Fawn = require("fawn");
const debug = require("debug")("app:rentals");

Fawn.init(mongoose);
const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    return res.send(rentals);
  })
);

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer)
      return res.status(400).send("Customer with given Id not found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie with given Id not found");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock");

    const rental = new Rental({
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

    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update(
          "movies",
          { _id: movie._id },
          {
            $inc: { numberInStock: -1 },
          }
        )
        .run();
      return res.send(rental);
    } catch (ex) {
      res.status(500).send("Transaction failed..");
    }
  })
);

module.exports = router;
