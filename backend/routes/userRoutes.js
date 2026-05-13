const express = require('express');
const bcrypt = require('bcryptjs');
const { auth, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// 1. Get all members (Populates dropdown and manage team list)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'Member' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 2. Create a new member account
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User with this email already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new member
    user = new User({ name, email, password: hashedPassword, role: 'Member' });
    await user.save();
    
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3. Delete a member
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Member removed successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;