const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const debug = require("debug")("app:customers");

const router = express.Router();

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

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
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

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
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
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    return res.send(customer);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
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

module.exports = router;
