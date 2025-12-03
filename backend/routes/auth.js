const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      role, 
      skills: skills || [] 
    });
    await user.save();

    // Create token with userId
    const token = jwt.encode(
      { userId: user._id.toString() }, 
      process.env.JWT_SECRET
    );

    res.json({ 
      message: 'Signup successful', 
      token, 
      user: { 
        id: user._id, 
        name, 
        email, 
        role 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create token with userId
    const token = jwt.encode(
      { userId: user._id.toString() }, 
      process.env.JWT_SECRET
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
