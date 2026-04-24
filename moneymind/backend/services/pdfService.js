const PDFDocument = require('pdfkit');
const pool = require('../config/db');

const BRAND = { primary: '#0e7490', accent: '#14b8a6', dark: '#0f172a', gray: '#64748b' };

const drawHeader = (doc, user, title, subtitle) => {
  doc.rect(0, 0, 612, 80).fill(BRAND.dark);
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#ffffff').text('MoneyMind Analyzer', 50, 22);
  doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text('Understand Your Spending. Shape Your Future.', 50, 46);
  doc.fontSize(9).fillColor('#94a3b8').text(`Currency: ${user.currency || 'PKR'}`, 450, 22, { align: 'right', width: 112 });
  doc.fontSize(9).fillColor('#94a3b8').text(`Generated: ${new Date().toLocaleDateString('en-PK')}`, 450, 36, { align: 'right', width: 112 });
  doc.fontSize(14).font('Helvetica-Bold').fillColor(BRAND.primary).text(title, 50, 100);
  doc.fontSize(10).font('Helvetica').fillColor(BRAND.gray).text(subtitle, 50, 118);
  doc.moveTo(50, 134).lineTo(562, 134).strokeColor('#e2e8f0').lineWidth(1).stroke();
  return 150;
};

const formatCurrency = (amount, currency = 'PKR') => {
  const num = Number(amount) || 0;
  if (currency === 'PKR') return `Rs. ${num.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
};

const generateMonthlyReport = async (userId, month, year, user, res) => {
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
  const currency  = user.currency || 'PKR';

  const { rows: expenses } = await pool.query(
    `SELECT e.*, c.name AS category_name
     FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3
     ORDER BY e.date ASC`,
    [userId, month, year]
  );

  const { rows: behaviorRows } = await pool.query(
    'SELECT * FROM behavior_reports WHERE user_id = $1 AND month = $2 AND year = $3',
    [userId, month, year]
  );

  const income   = expenses.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0);
  const totalExp = expenses.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0);
  const savings  = income - totalExp;

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=moneymind-monthly-${year}-${month}.pdf`);
  doc.pipe(res);

  let y = drawHeader(doc, user, `Monthly Financial Report — ${monthName} ${year}`, `Account: ${user.name} | ${user.email}`);

  doc.rect(50, y, 155, 60).fillColor('#f0fdfa').fill();
  doc.rect(215, y, 155, 60).fillColor('#fff1f2').fill();
  doc.rect(380, y, 155, 60).fillColor('#f0f9ff').fill();

  const stat = (x, yy, label, value, color) => {
    doc.fontSize(8).font('Helvetica').fillColor(BRAND.gray).text(label, x + 10, yy + 10);
    doc.fontSize(14).font('Helvetica-Bold').fillColor(color).text(value, x + 10, yy + 24, { width: 135 });
  };

  stat(50,  y, 'TOTAL INCOME',  formatCurrency(income, currency),   BRAND.primary);
  stat(215, y, 'TOTAL EXPENSES', formatCurrency(totalExp, currency), '#dc2626');
  stat(380, y, 'NET SAVINGS',   formatCurrency(savings, currency),   savings >= 0 ? BRAND.primary : '#dc2626');
  y += 80;

  if (behaviorRows.length) {
    const b = behaviorRows[0];
    doc.fontSize(12).font('Helvetica-Bold').fillColor(BRAND.primary).text('Behavioral Intelligence', 50, y);
    y += 18;
    doc.fontSize(10).font('Helvetica').fillColor(BRAND.dark);
    doc.text(`Behavior Score: ${b.score}/100`, 50, y);
    doc.text(`Personality Type: ${b.personality_type}`, 200, y);
    doc.text(`Savings Rate: ${(Number(b.savings_rate) * 100).toFixed(1)}%`, 400, y);
    y += 20;

    if (b.insights) {
      const insights = typeof b.insights === 'string' ? JSON.parse(b.insights) : b.insights;
      if (Array.isArray(insights)) {
        insights.forEach(ins => {
          doc.rect(50, y, 512, 28).fillColor(ins.type === 'warning' ? '#fffbeb' : ins.type === 'positive' ? '#f0fdf4' : '#eff6ff').fill();
          doc.fontSize(9).font('Helvetica-Bold').fillColor(BRAND.dark).text(ins.title, 60, y + 6);
          doc.fontSize(8).font('Helvetica').fillColor(BRAND.gray).text(ins.message, 60, y + 17, { width: 492 });
          y += 36;
        });
      }
    }
    y += 8;
  }

  doc.moveTo(50, y).lineTo(562, y).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
  y += 12;

  doc.fontSize(12).font('Helvetica-Bold').fillColor(BRAND.primary).text('Transaction Detail', 50, y);
  y += 16;

  doc.rect(50, y, 512, 18).fillColor(BRAND.dark).fill();
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff');
  doc.text('Date', 55, y + 5);
  doc.text('Description', 115, y + 5);
  doc.text('Category', 310, y + 5);
  doc.text('Type', 420, y + 5);
  doc.text(`Amount (${currency})`, 460, y + 5);
  y += 20;

  expenses.forEach((e, i) => {
    if (y > 750) { doc.addPage(); y = 50; }
    if (i % 2 === 0) doc.rect(50, y, 512, 16).fillColor('#f8fafc').fill();
    const col = e.type === 'income' ? BRAND.primary : '#dc2626';
    doc.fontSize(8).font('Helvetica').fillColor(BRAND.dark);
    doc.text(new Date(e.date).toLocaleDateString('en-PK'), 55, y + 4);
    doc.text(e.description.substring(0, 28), 115, y + 4);
    doc.text(e.category_name || 'Uncategorized', 310, y + 4);
    doc.fillColor(col).text(e.type, 420, y + 4);
    doc.fillColor(col).text(formatCurrency(e.amount, currency), 460, y + 4);
    y += 18;
  });

  doc.fontSize(7).font('Helvetica').fillColor(BRAND.gray)
    .text('Generated by MoneyMind Analyzer — moneymind.io', 50, 790, { align: 'center', width: 512 });

  doc.end();
};

const generateStatement = async (userId, from, to, user, res) => {
  const currency = user.currency || 'PKR';
  const params = [userId];
  let where = 'WHERE e.user_id = $1';
  if (from) { params.push(from); where += ` AND e.date >= $${params.length}`; }
  if (to)   { params.push(to);   where += ` AND e.date <= $${params.length}`; }

  const { rows } = await pool.query(
    `SELECT e.*, c.name AS category_name FROM expenses e
     LEFT JOIN categories c ON e.category_id = c.id
     ${where} ORDER BY e.date ASC`,
    params
  );

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=moneymind-statement.pdf');
  doc.pipe(res);

  let y = drawHeader(doc, user, 'Transaction Statement', `${user.name} | Period: ${from || 'All'} to ${to || 'Present'}`);
  let balance = 0;

  doc.rect(50, y, 512, 18).fillColor(BRAND.dark).fill();
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff');
  ['Date','Description','Type','Amount','Balance'].forEach((h, i) => {
    doc.text(h, 55 + [0, 80, 280, 360, 440][i], y + 5);
  });
  y += 20;

  rows.forEach((e, i) => {
    if (y > 750) { doc.addPage(); y = 50; }
    const amt = Number(e.amount);
    balance += e.type === 'income' ? amt : -amt;
    if (i % 2 === 0) doc.rect(50, y, 512, 16).fillColor('#f8fafc').fill();
    doc.fontSize(8).font('Helvetica').fillColor(BRAND.dark);
    doc.text(new Date(e.date).toLocaleDateString('en-PK'), 55, y + 4);
    doc.text(e.description.substring(0, 25), 135, y + 4);
    doc.fillColor(e.type === 'income' ? BRAND.primary : '#dc2626').text(e.type, 335, y + 4);
    doc.fillColor(e.type === 'income' ? BRAND.primary : '#dc2626').text(formatCurrency(amt, currency), 415, y + 4);
    doc.fillColor(balance >= 0 ? BRAND.primary : '#dc2626').text(formatCurrency(balance, currency), 495, y + 4);
    y += 18;
  });

  doc.end();
};

const generateBehaviorReport = async (userId, month, year, user, res) => {
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
  const { rows } = await pool.query(
    'SELECT * FROM behavior_reports WHERE user_id = $1 AND month = $2 AND year = $3',
    [userId, month, year]
  );

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=moneymind-behavior-${year}-${month}.pdf`);
  doc.pipe(res);

  let y = drawHeader(doc, user, `AI Behavior Intelligence Report — ${monthName} ${year}`, `Financial Personality Analysis for ${user.name}`);

  if (!rows.length) {
    doc.fontSize(12).fillColor(BRAND.gray).text('No behavior report available. Add transactions and run analysis first.', 50, y);
    doc.end();
    return;
  }

  const b = rows[0];
  doc.fontSize(28).font('Helvetica-Bold').fillColor(BRAND.primary).text(`${b.score}`, 50, y);
  doc.fontSize(10).font('Helvetica').fillColor(BRAND.gray).text('/ 100 Behavior Score', 95, y + 12);
  doc.rect(50, y + 35, 512, 8).fillColor('#e2e8f0').fill();
  doc.rect(50, y + 35, Math.round(5.12 * b.score), 8).fillColor(BRAND.primary).fill();
  y += 60;

  doc.fontSize(14).font('Helvetica-Bold').fillColor(BRAND.dark).text(`Personality: ${b.personality_type}`, 50, y);
  y += 24;

  const dims = [
    { label: 'Savings Rate',      val: Math.round(Number(b.savings_rate)      * 100) },
    { label: 'Impulse Control',   val: Math.round((1 - Number(b.impulse_ratio)) * 100) },
    { label: 'Consistency',       val: Math.round(Number(b.consistency_score) * 100) },
  ];

  dims.forEach(d => {
    doc.fontSize(9).font('Helvetica').fillColor(BRAND.gray).text(d.label, 50, y);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(BRAND.primary).text(`${d.val}%`, 500, y, { align: 'right', width: 62 });
    doc.rect(50, y + 12, 512, 5).fillColor('#e2e8f0').fill();
    doc.rect(50, y + 12, Math.round(5.12 * d.val), 5).fillColor(BRAND.primary).fill();
    y += 28;
  });

  if (b.insights) {
    y += 8;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(BRAND.primary).text('AI-Generated Insights', 50, y);
    y += 18;
    const insights = typeof b.insights === 'string' ? JSON.parse(b.insights) : b.insights;
    if (Array.isArray(insights)) {
      insights.forEach(ins => {
        doc.rect(50, y, 512, 40).fillColor('#f8fafc').fill();
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BRAND.dark).text(ins.title, 60, y + 8);
        doc.fontSize(9).font('Helvetica').fillColor(BRAND.gray).text(ins.message, 60, y + 22, { width: 492 });
        y += 50;
      });
    }
  }

  doc.end();
};

module.exports = { generateMonthlyReport, generateStatement, generateBehaviorReport };
