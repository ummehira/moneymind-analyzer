const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res, next) => {
  try {
    const { name, email, password, currency = 'PKR' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, currency)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, currency, plan, created_at`,
      [name, email, hash, currency]
    );
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    await seedDefaultCategories(rows[0].id);
    res.status(201).json({ user: rows[0], token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    const { password_hash, ...user } = rows[0];
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, currency, plan, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateCurrency = async (req, res, next) => {
  try {
    const { currency } = req.body;
    const supported = ['PKR', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR'];
    if (!supported.includes(currency)) {
      return res.status(400).json({ error: `Unsupported currency. Supported: ${supported.join(', ')}` });
    }
    const { rows } = await pool.query(
      'UPDATE users SET currency = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, currency',
      [currency, req.user.id]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};

const seedDefaultCategories = async (userId) => {
  const defaults = [
    { name: 'Housing',        color: '#0ea5e9', icon: 'home' },
    { name: 'Food & Dining',  color: '#22d3ee', icon: 'utensils' },
    { name: 'Transport',      color: '#6366f1', icon: 'car' },
    { name: 'Shopping',       color: '#f59e0b', icon: 'shopping-bag' },
    { name: 'Entertainment',  color: '#ec4899', icon: 'film' },
    { name: 'Healthcare',     color: '#10b981', icon: 'heart' },
    { name: 'Education',      color: '#8b5cf6', icon: 'book' },
    { name: 'Utilities',      color: '#f97316', icon: 'zap' },
    { name: 'Salary',         color: '#14b8a6', icon: 'briefcase' },
    { name: 'Freelance',      color: '#06b6d4', icon: 'code' },
    { name: 'Business',       color: '#3b82f6', icon: 'trending-up' },
    { name: 'Other',          color: '#64748b', icon: 'more-horizontal' },
  ];
  for (const cat of defaults) {
    await pool.query(
      `INSERT INTO categories (user_id, name, color, icon, is_default)
       VALUES ($1, $2, $3, $4, TRUE) ON CONFLICT DO NOTHING`,
      [userId, cat.name, cat.color, cat.icon]
    );
  }
};

module.exports = { register, login, getMe, updateCurrency };
