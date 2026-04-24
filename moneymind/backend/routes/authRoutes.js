const express = require('express');
const { register, login, getMe, updateCurrency } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/currency', protect, updateCurrency);
module.exports = router;
