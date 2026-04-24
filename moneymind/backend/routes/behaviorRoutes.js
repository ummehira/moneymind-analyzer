// behaviorRoutes.js
const express1 = require('express');
const { getReport, getHistory } = require('../controllers/behaviorController');
const { protect: p1 } = require('../middleware/authMiddleware');
const r1 = express1.Router();
r1.use(p1);
r1.get('/report', getReport);
r1.get('/history', getHistory);
module.exports = r1;
