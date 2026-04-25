const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter }  = require('./middleware/rateLimiter');

const authRoutes       = require('./routes/authRoutes');
const expenseRoutes    = require('./routes/expenseRoutes');
const analyticsRoutes  = require('./routes/analyticsRoutes');
const behaviorRoutes   = require('./routes/behaviorRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const reportRoutes     = require('./routes/reportRoutes');
const alertRoutes      = require('./routes/alertRoutes');
const savingsRoutes    = require('./routes/savingsRoutes');

const app = express();

// ── Middleware first ──────────────────────────────
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      'https://moneymind-analyzer-2.onrender.com',
      'https://moneymind-analyzer-1.onrender.com',
      'http://localhost:5173',
    ].filter(Boolean)
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(rateLimiter);

// ── Health check ──────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'MoneyMind API' }));

// ── Routes ────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/expenses',    expenseRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/behavior',    behaviorRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reports',     reportRoutes);
app.use('/api/alerts',      alertRoutes);
app.use('/api/savings',     savingsRoutes);

// ── Error handler last ────────────────────────────
app.use(errorHandler);

module.exports = app;