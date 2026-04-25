const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const authRoutes       = require('./routes/authRoutes');
const expenseRoutes    = require('./routes/expenseRoutes');
const analyticsRoutes  = require('./routes/analyticsRoutes');
const behaviorRoutes   = require('./routes/behaviorRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const reportRoutes     = require('./routes/reportRoutes');
const alertRoutes      = require('./routes/alertRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(rateLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'MoneyMind API' }));

app.use('/api/auth',        authRoutes);
app.use('/api/expenses',    expenseRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/behavior',    behaviorRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reports',     reportRoutes);
app.use('/api/alerts',      alertRoutes);

app.use(errorHandler);

module.exports = app;
