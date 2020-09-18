process.env.DEBUG = "app:index";

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:index");
const app = express();

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => debug("Connected to MongoDB"))
  .catch((error) => debug("Could not connect to MongoDB", error.message));

const port = process.env.PORT || 5000;
app.listen(port, () => debug(`Listening on port ${port}...`));
