const mongoose = require("mongoose");
const winston = require("winston");
const debug = require("debug")("app:db");

module.exports = function(){
  mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    debug("Connected to MongoDB")
    winston.info("Connected to MongoDB")
  })
}