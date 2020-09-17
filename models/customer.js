const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      length: 10,
    },
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).required(),
    isGold: Joi.boolean(),
    phone: Joi.string()
      .length(10)
      .regex(/^[0-9]+$/)
      .required(),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;