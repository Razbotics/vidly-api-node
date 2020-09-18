const { User, validate } = require("../models/user");
const express = require("express");
const debug = require("debug")("app:users");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    return res.send(user);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    return res.send(user);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(user);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

module.exports = router;
