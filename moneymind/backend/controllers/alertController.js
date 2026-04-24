const pool = require('../config/db');

const getAlerts = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE alerts SET is_read = TRUE WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Alert marked as read' });
  } catch (err) {
    next(err);
  }
};

const dismiss = async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM alerts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Alert dismissed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAlerts, markRead, dismiss };
