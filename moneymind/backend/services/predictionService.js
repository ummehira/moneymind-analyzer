const pool = require('../config/db');

const predictEndOfMonth = async (userId) => {
  const now = new Date();
  const dayOfMonth  = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const { rows } = await pool.query(
    `SELECT type, SUM(amount) AS total
     FROM expenses
     WHERE user_id = $1 AND date >= date_trunc('month', CURRENT_DATE)
     GROUP BY type`,
    [userId]
  );

  const income  = Number(rows.find(r => r.type === 'income')?.total  || 0);
  const expense = Number(rows.find(r => r.type === 'expense')?.total || 0);

  const dailyBurnRate   = dayOfMonth > 0 ? expense / dayOfMonth : 0;
  const projectedExpense = dailyBurnRate * daysInMonth;
  const projectedSavings = income - projectedExpense;

  return {
    projectedSavings: Math.round(projectedSavings),
    projectedExpense: Math.round(projectedExpense),
    dailyBurnRate:    Math.round(dailyBurnRate),
    currentSavings:  Math.round(income - expense),
    overspendRisk:   Math.min(100, Math.round((projectedExpense / Math.max(1, income)) * 100)),
    confidence:      Math.min(95, Math.round(50 + dayOfMonth * 1.5)),
    daysRemaining:   daysInMonth - dayOfMonth,
  };
};

const predictCategoryRisk = async (userId) => {
  const { rows } = await pool.query(
    `SELECT c.name, c.color,
       AVG(e.amount)  AS avg_amount,
       SUM(e.amount)  AS total_amount,
       COUNT(*)       AS tx_count
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = $1
       AND e.type = 'expense'
       AND e.date >= NOW() - INTERVAL '3 months'
     GROUP BY c.name, c.color
     ORDER BY total_amount DESC`,
    [userId]
  );

  return rows.map(r => ({
    category:    r.name,
    color:       r.color,
    avgAmount:   Math.round(r.avg_amount),
    totalAmount: Math.round(r.total_amount),
    txCount:     Number(r.tx_count),
    riskLevel:   r.avg_amount > 20000 ? 'high' : r.avg_amount > 8000 ? 'medium' : 'low',
  }));
};

module.exports = { predictEndOfMonth, predictCategoryRisk };
