const genres = require("./routes/genres");
const movies = require("./routes/movies");
const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("app:db");
const app = express();

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => debug("Connected to MongoDB"))
  .catch((error) => debug("Could not connect to MongoDB", error.message));



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
