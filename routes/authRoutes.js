const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model'); 
const router = express.Router();

// GET route for the registration form
router.get('/signup', (req, res) => { 
  res.render('signup');
});

// POST route to handle user registration
router.post('/signup', async (req, res) => { 
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    // Save the user to the database
    await newUser.save();
    res.redirect('/auth/login'); // Redirect to the login page after successful registration
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// GET route for the login form
router.get('/login', (req, res) => { 
  res.render('login');
});

// POST route to handle user login
router.post('/login', async (req, res) => { 
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If the password is correct, store the user data in the session
    req.session.user = {
      id: user._id,
      username: user.username,
    };
    res.redirect('/'); // Redirect to the dashboard page after successful login
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
