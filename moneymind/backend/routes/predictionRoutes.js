const express = require('express');
const { getEndOfMonth, getCategoryRisk } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect);
router.get('/eom', getEndOfMonth);
router.get('/categories', getCategoryRisk);
module.exports = router;
