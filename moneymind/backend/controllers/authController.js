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

const sendTwoFactorCode = async (req, res, next) => {
  try {
    const crypto = require('crypto')
    const code   = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await pool.query(
      'UPDATE users SET two_factor_code = $1, two_factor_code_expiry = $2 WHERE id = $3',
      [code, expiry, req.user.id]
    )

    // In production send via email/SMS
    console.log(`2FA code for user ${req.user.id}: ${code}`)

    res.json({
      message: '2FA code sent',
      dev_code: code // Remove in production
    })
  } catch(err) {
    next(err)
  }
}

const verifyTwoFactorCode = async (req, res, next) => {
  try {
    const { code } = req.body
    const { rows } = await pool.query(
      'SELECT two_factor_code, two_factor_code_expiry FROM users WHERE id = $1',
      [req.user.id]
    )

    if (!rows.length) return res.status(404).json({ error: 'User not found' })

    const user = rows[0]
    if (!user.two_factor_code) return res.status(400).json({ error: 'No active 2FA code' })
    if (new Date() > new Date(user.two_factor_code_expiry)) return res.status(400).json({ error: '2FA code expired. Request a new one.' })
    if (user.two_factor_code !== code) return res.status(400).json({ error: 'Invalid code' })

    await pool.query(
      'UPDATE users SET two_factor_code = NULL, two_factor_code_expiry = NULL, two_factor_enabled = TRUE WHERE id = $1',
      [req.user.id]
    )

    res.json({ message: '2FA verified successfully', enabled: true })
  } catch(err) {
    next(err)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Both current and new password are required' })
    }
    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id])
    if (!rows.length) return res.status(404).json({ error: 'User not found' })

    const match = await bcrypt.compare(current_password, rows[0].password_hash)
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' })

    const hash = await bcrypt.hash(new_password, 12)
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.id])

    res.json({ message: 'Password changed successfully' })
  } catch(err) {
    next(err)
  }
}

module.exports = { register, login, getMe, updateCurrency, sendTwoFactorCode, verifyTwoFactorCode, changePassword }