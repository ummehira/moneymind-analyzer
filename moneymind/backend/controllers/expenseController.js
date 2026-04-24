const pool = require('../config/db');
const alertService = require('../services/alertService');

const addExpense = async (req, res, next) => {
  try {
    const { description, amount, type, category_id, date, notes } = req.body;
    if (!description || !amount || !type || !date) {
      return res.status(400).json({ error: 'description, amount, type and date are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be income or expense' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'amount must be greater than 0' });
    }
    const { rows } = await pool.query(
      `INSERT INTO expenses (user_id, description, amount, type, category_id, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, description, Number(amount), type, category_id || null, date, notes || null]
    );
    if (type === 'expense') {
      await alertService.checkForAnomalies(req.user.id, rows[0]);
    }
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const { from, to, category, type, page = 1, limit = 30 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params = [req.user.id];
    let where = 'WHERE e.user_id = $1';

    if (from)     { params.push(from);     where += ` AND e.date >= $${params.length}`; }
    if (to)       { params.push(to);       where += ` AND e.date <= $${params.length}`; }
    if (category) { params.push(category); where += ` AND c.name = $${params.length}`; }
    if (type)     { params.push(type);     where += ` AND e.type = $${params.length}`; }

    params.push(Number(limit), offset);
    const query = `
      SELECT e.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      ${where}
      ORDER BY e.date DESC, e.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const countQuery = `SELECT COUNT(*) FROM expenses e LEFT JOIN categories c ON e.category_id = c.id ${where}`;
    const [{ rows }, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, -2)),
    ]);
    res.json({
      data: rows,
      total: Number(countResult.rows[0].count),
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    next(err);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, c.name AS category_name FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.id = $1 AND e.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { description, amount, type, category_id, date, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE expenses SET
         description = COALESCE($1, description),
         amount      = COALESCE($2, amount),
         type        = COALESCE($3, type),
         category_id = COALESCE($4, category_id),
         date        = COALESCE($5, date),
         notes       = COALESCE($6, notes),
         updated_at  = NOW()
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [description, amount ? Number(amount) : null, type, category_id, date, notes, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY is_default DESC, name ASC',
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { addExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getCategories };
