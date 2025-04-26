const express = require('express');
const { registerUser, loginUser, logoutUser, verifyEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
