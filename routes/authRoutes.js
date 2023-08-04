const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const router = express.Router();
const { isAuthenticated } = require("../middleware/route-guard");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});


router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
    };
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/main", isAuthenticated, (req, res) => {
  res.render("main");
});

router.get("/private", isAuthenticated, (req, res) => {
  res.render("private");
});

module.exports = router;
