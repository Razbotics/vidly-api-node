const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const debug = require("debug")("app:customers");

const router = express.Router();

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

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    return res.send(customers);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    return res.send(customer);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newCustomer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });

    const result = await newCustomer.save();
    return res.send(result);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          isGold: req.body.isGold,
          phone: req.body.phone,
        },
      },
      { new: true, useFindAndModify: false }
    );
    res.send(customer);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete({ _id: req.params.id });
    debug(customer);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    res.send(customer);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

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

module.exports = router;
