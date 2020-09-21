process.env.DEBUG = "app:*";
process.env.vidly_jwtPrivateKey = "mySecureKey";
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const error = require("./middleware/error");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:index");
const app = express();

if (!config.get("jwtPrivateKey")) {
  debug("FATAL ERROR: jwtPrivateKey not set");
  process.exit(1);
}

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

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
