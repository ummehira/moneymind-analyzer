const behaviorEngine = require('../services/behaviorEngine');
const pool = require('../config/db');

const getReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = Number(month) || new Date().getMonth() + 1;
    const y = Number(year)  || new Date().getFullYear();

    const { rows: existing } = await pool.query(
      'SELECT * FROM behavior_reports WHERE user_id = $1 AND month = $2 AND year = $3',
      [req.user.id, m, y]
    );

    if (existing.length && !req.query.refresh) {
      return res.json({ data: existing[0] });
    }

    const report = await behaviorEngine.generateBehaviorReport(req.user.id, m, y);
    res.json({ data: report });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT month, year, score, personality_type, savings_rate
       FROM behavior_reports
       WHERE user_id = $1
       ORDER BY year DESC, month DESC
       LIMIT 12`,
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReport, getHistory };
