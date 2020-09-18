const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().max(200).required(),
    password: Joi.string().min(1).max(200),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
