const express = require('express');
const { getAlerts, markRead, dismiss } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect);
router.get('/', getAlerts);
router.patch('/:id/read', markRead);
router.delete('/:id', dismiss);
module.exports = router;
