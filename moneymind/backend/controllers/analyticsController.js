const pool = require('../config/db');

const getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = month || new Date().getMonth() + 1;
    const y = year  || new Date().getFullYear();

    const { rows } = await pool.query(
      `SELECT type, SUM(amount) AS total, COUNT(*) AS count
       FROM expenses
       WHERE user_id = $1
         AND EXTRACT(MONTH FROM date) = $2
         AND EXTRACT(YEAR  FROM date) = $3
       GROUP BY type`,
      [req.user.id, m, y]
    );

    const income  = rows.find(r => r.type === 'income')?.total  || 0;
    const expense = rows.find(r => r.type === 'expense')?.total || 0;

    const prevM = m == 1 ? 12 : Number(m) - 1;
    const prevY = m == 1 ? Number(y) - 1 : y;

    const { rows: prev } = await pool.query(
      `SELECT type, SUM(amount) AS total FROM expenses
       WHERE user_id = $1
         AND EXTRACT(MONTH FROM date) = $2
         AND EXTRACT(YEAR  FROM date) = $3
       GROUP BY type`,
      [req.user.id, prevM, prevY]
    );

    const prevIncome  = prev.find(r => r.type === 'income')?.total  || 1;
    const prevExpense = prev.find(r => r.type === 'expense')?.total || 1;

    res.json({
      data: {
        income:         Number(income),
        expense:        Number(expense),
        savings:        Number(income) - Number(expense),
        savingsRate:    income > 0 ? ((income - expense) / income * 100).toFixed(1) : '0',
        incomeChange:   (((income - prevIncome) / prevIncome) * 100).toFixed(1),
        expenseChange:  (((expense - prevExpense) / prevExpense) * 100).toFixed(1),
        month: Number(m),
        year:  Number(y),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = month || new Date().getMonth() + 1;
    const y = year  || new Date().getFullYear();

    const { rows } = await pool.query(
      `SELECT c.name, c.color, c.icon, SUM(e.amount) AS total, COUNT(*) AS count
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = $1
         AND e.type = 'expense'
         AND EXTRACT(MONTH FROM e.date) = $2
         AND EXTRACT(YEAR  FROM e.date) = $3
       GROUP BY c.name, c.color, c.icon
       ORDER BY total DESC`,
      [req.user.id, m, y]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

const getTrend = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         EXTRACT(YEAR  FROM date)  AS year,
         EXTRACT(MONTH FROM date)  AS month,
         type,
         SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1
         AND date >= NOW() - INTERVAL '6 months'
       GROUP BY year, month, type
       ORDER BY year, month`,
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

const getAnomalies = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, c.name AS category_name,
         AVG(e2.amount) OVER (PARTITION BY e.category_id) AS avg_category,
         e.amount / NULLIF(AVG(e2.amount) OVER (PARTITION BY e.category_id), 0) AS ratio
       FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       LEFT JOIN expenses e2 ON e2.category_id = e.category_id AND e2.user_id = e.user_id
       WHERE e.user_id = $1
         AND e.type = 'expense'
         AND e.date >= NOW() - INTERVAL '30 days'
       GROUP BY e.id, c.name
       HAVING e.amount > AVG(e2.amount) * 2
       ORDER BY ratio DESC
       LIMIT 10`,
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getByCategory, getTrend, getAnomalies };
