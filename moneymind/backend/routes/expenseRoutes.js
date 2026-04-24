const express = require('express');
const { addExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getCategories } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect);
router.get('/categories', getCategories);
router.route('/').get(getExpenses).post(addExpense);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);
module.exports = router;
