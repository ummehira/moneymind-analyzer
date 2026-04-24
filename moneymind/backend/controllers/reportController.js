const pdfService = require('../services/pdfService');
const pool = require('../config/db');

const downloadMonthly = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = Number(month) || new Date().getMonth() + 1;
    const y = Number(year)  || new Date().getFullYear();
    const { rows: userRows } = await pool.query(
      'SELECT name, email, currency FROM users WHERE id = $1', [req.user.id]
    );
    await pdfService.generateMonthlyReport(req.user.id, m, y, userRows[0], res);
  } catch (err) {
    next(err);
  }
};

const downloadStatement = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const { rows: userRows } = await pool.query(
      'SELECT name, email, currency FROM users WHERE id = $1', [req.user.id]
    );
    await pdfService.generateStatement(req.user.id, from, to, userRows[0], res);
  } catch (err) {
    next(err);
  }
};

const downloadBehavior = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = Number(month) || new Date().getMonth() + 1;
    const y = Number(year)  || new Date().getFullYear();
    const { rows: userRows } = await pool.query(
      'SELECT name, email, currency FROM users WHERE id = $1', [req.user.id]
    );
    await pdfService.generateBehaviorReport(req.user.id, m, y, userRows[0], res);
  } catch (err) {
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const params = [req.user.id];
    let where = 'WHERE e.user_id = $1';
    if (from) { params.push(from); where += ` AND e.date >= $${params.length}`; }
    if (to)   { params.push(to);   where += ` AND e.date <= $${params.length}`; }

    const { rows } = await pool.query(
      `SELECT e.date, e.description, e.type, e.amount, c.name AS category, e.notes
       FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
       ${where} ORDER BY e.date DESC`,
      params
    );

    const { rows: userRows } = await pool.query(
      'SELECT currency FROM users WHERE id = $1', [req.user.id]
    );
    const currency = userRows[0]?.currency || 'PKR';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=moneymind-transactions.csv');

    const header = `Date,Description,Type,Amount (${currency}),Category,Notes\n`;
    const body = rows.map(r =>
      `${r.date},${JSON.stringify(r.description)},${r.type},${r.amount},${r.category || ''},${JSON.stringify(r.notes || '')}`
    ).join('\n');

    res.send(header + body);
  } catch (err) {
    next(err);
  }
};

module.exports = { downloadMonthly, downloadStatement, downloadBehavior, exportCSV };
