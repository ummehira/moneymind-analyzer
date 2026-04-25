const express = require('express')
const { getGoals, createGoal, deleteGoal } = require('../controllers/savingsController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()
router.use(protect)
router.get('/', getGoals)
router.post('/', createGoal)
router.delete('/:id', deleteGoal)
module.exports = router