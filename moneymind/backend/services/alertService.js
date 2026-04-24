const pool = require('../config/db');

const checkForAnomalies = async (userId, expense) => {
  try {
    if (!expense.category_id) return;

    const { rows: avgRows } = await pool.query(
      `SELECT AVG(amount) AS avg FROM expenses
       WHERE user_id = $1 AND category_id = $2 AND type = 'expense'
         AND id != $3`,
      [userId, expense.category_id, expense.id]
    );

    const avg = Number(avgRows[0]?.avg || 0);
    if (avg > 0 && Number(expense.amount) > avg * 2.5) {
      await pool.query(
        `INSERT INTO alerts (user_id, type, severity, title, message, expense_id)
         VALUES ($1, 'anomaly', 'danger', $2, $3, $4)`,
        [
          userId,
          'Unusual Transaction Detected',
          `A transaction of ${Number(expense.amount).toLocaleString()} is ${(Number(expense.amount) / avg).toFixed(1)}x above your category average.`,
          expense.id,
        ]
      );
    }

    await checkBudgetWarnings(userId, expense.category_id);
  } catch (err) {
    console.error('Alert check error:', err);
  }
};

const checkBudgetWarnings = async (userId, categoryId) => {
  const now = new Date();
  const { rows } = await pool.query(
    `SELECT SUM(amount) AS spent FROM expenses
     WHERE user_id = $1 AND category_id = $2 AND type = 'expense'
       AND date >= date_trunc('month', CURRENT_DATE)`,
    [userId, categoryId]
  );

  const spent = Number(rows[0]?.spent || 0);
  if (spent > 30000) {
    await pool.query(
      `INSERT INTO alerts (user_id, type, severity, title, message)
       VALUES ($1, 'budget', 'warning', $2, $3)
       ON CONFLICT DO NOTHING`,
      [
        userId,
        'High Spending in Category',
        `You have spent Rs. ${spent.toLocaleString()} this month in this category.`,
      ]
    );
  }
};

module.exports = { checkForAnomalies };
