const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Example route to get all users - only accessible by admin
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
