const pool = require('../config/db');
const openaiService = require('./openaiService');

const computeImpulseRatio = (expenses) => {
  const impulseCategories = ['Shopping', 'Entertainment', 'Food & Dining'];
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const impulse = expenses
    .filter(e => impulseCategories.includes(e.category_name))
    .reduce((s, e) => s + Number(e.amount), 0);
  return total > 0 ? impulse / total : 0;
};

const computeConsistency = (expenses) => {
  if (expenses.length < 3) return 0.5;
  const daily = {};
  expenses.forEach(e => {
    const d = new Date(e.date).toISOString().split('T')[0];
    daily[d] = (daily[d] || 0) + Number(e.amount);
  });
  const vals = Object.values(daily);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / vals.length;
  return Math.max(0, Math.min(1, 1 - Math.sqrt(variance) / (mean + 1)));
};

const computeVolatility = (expenses) => {
  const weekly = {};
  expenses.forEach(e => {
    const w = Math.floor(new Date(e.date).getDate() / 7);
    weekly[w] = (weekly[w] || 0) + Number(e.amount);
  });
  const vals = Object.values(weekly);
  if (vals.length < 2) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.min(1, Math.max(...vals.map(v => Math.abs(v - mean))) / (mean + 1));
};

const computeBehaviorScore = (metrics) => {
  const { savingsRate, impulseRatio, budgetAdherence, consistencyScore, anomalyCount } = metrics;
  const score =
    Math.min(1, savingsRate)        * 30 +
    (1 - impulseRatio)              * 25 +
    budgetAdherence                 * 25 +
    consistencyScore                * 15 +
    Math.max(0, 5 - anomalyCount)   *  1;
  return Math.min(100, Math.max(0, Math.round(score * 100)));
};

const classifyPersonality = (metrics) => {
  const { savingsRate, impulseRatio, volatility } = metrics;
  if (savingsRate >= 0.35 && impulseRatio <= 0.15)  return 'Saver';
  if (impulseRatio >= 0.45)                          return 'Impulsive Spender';
  if (volatility   >= 0.40)                          return 'Risk Taker';
  return 'Balanced Spender';
};

const generateBehaviorReport = async (userId, month, year) => {
  const { rows } = await pool.query(
    `SELECT e.*, c.name AS category_name
     FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = $1
       AND EXTRACT(MONTH FROM e.date) = $2
       AND EXTRACT(YEAR  FROM e.date) = $3`,
    [userId, month, year]
  );

  const income   = rows.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
  const expenses = rows.filter(r => r.type === 'expense');
  const totalExp = expenses.reduce((s, r) => s + Number(r.amount), 0);

  const metrics = {
    savingsRate:       income > 0 ? (income - totalExp) / income : 0,
    impulseRatio:      computeImpulseRatio(expenses),
    consistencyScore:  computeConsistency(expenses),
    volatility:        computeVolatility(expenses),
    budgetAdherence:   0.70,
    anomalyCount:      expenses.filter(e => Number(e.amount) > 50000).length,
    income,
    totalExp,
  };

  const score       = computeBehaviorScore(metrics);
  const personality = classifyPersonality(metrics);
  const insights    = await openaiService.generateInsights(metrics, personality);

  const { rows: reportRows } = await pool.query(
    `INSERT INTO behavior_reports
       (user_id, month, year, score, personality_type, savings_rate,
        impulse_ratio, consistency_score, volatility_score, insights, generated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
     ON CONFLICT (user_id, month, year) DO UPDATE
       SET score             = EXCLUDED.score,
           personality_type  = EXCLUDED.personality_type,
           savings_rate      = EXCLUDED.savings_rate,
           impulse_ratio     = EXCLUDED.impulse_ratio,
           consistency_score = EXCLUDED.consistency_score,
           volatility_score  = EXCLUDED.volatility_score,
           insights          = EXCLUDED.insights,
           generated_at      = NOW()
     RETURNING *`,
    [userId, month, year, score, personality,
     metrics.savingsRate, metrics.impulseRatio,
     metrics.consistencyScore, metrics.volatility,
     JSON.stringify(insights)]
  );

  return reportRows[0];
};

module.exports = { generateBehaviorReport, computeBehaviorScore, classifyPersonality };
