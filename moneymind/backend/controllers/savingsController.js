const pool = require('../config/db')

const getGoals = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT sg.*,
        COALESCE((
          SELECT SUM(amount) FROM expenses
          WHERE user_id = $1 AND type = 'income'
            AND date >= date_trunc('month', CURRENT_DATE)
        ), 0) -
        COALESCE((
          SELECT SUM(amount) FROM expenses
          WHERE user_id = $1 AND type = 'expense'
            AND date >= date_trunc('month', CURRENT_DATE)
        ), 0) AS current_savings
       FROM savings_goals sg
       WHERE sg.user_id = $1
       ORDER BY sg.created_at DESC`,
      [req.user.id]
    )
    res.json({ data: rows })
  } catch(err) { next(err) }
}

const createGoal = async (req, res, next) => {
  try {
    const { title, min_amount, max_amount, target_date } = req.body
    if (!title || !min_amount || !max_amount) {
      return res.status(400).json({ error: 'title, min_amount and max_amount are required' })
    }
    if (Number(min_amount) > Number(max_amount)) {
      return res.status(400).json({ error: 'min_amount cannot be greater than max_amount' })
    }
    const { rows } = await pool.query(
      `INSERT INTO savings_goals (user_id, title, min_amount, max_amount, target_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, min_amount, max_amount, target_date || null]
    )
    res.status(201).json({ data: rows[0] })
  } catch(err) { next(err) }
}

const deleteGoal = async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM savings_goals WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    res.json({ message: 'Goal deleted' })
  } catch(err) { next(err) }
}

module.exports = { getGoals, createGoal, deleteGoal }