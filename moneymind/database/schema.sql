-- MoneyMind Analyzer — Full Database Schema
-- Compatible with Neon PostgreSQL (serverless Postgres)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  currency      VARCHAR(10)  NOT NULL DEFAULT 'PKR',
  plan          VARCHAR(20)  NOT NULL DEFAULT 'free' CHECK (plan IN ('free','premium','enterprise')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL       PRIMARY KEY,
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(80)  NOT NULL,
  color       VARCHAR(7)   DEFAULT '#14b8a6',
  icon        VARCHAR(40)  DEFAULT 'tag',
  is_default  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS expenses (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description VARCHAR(255)  NOT NULL,
  amount      NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  type        VARCHAR(10)   NOT NULL CHECK (type IN ('income','expense')),
  category_id INTEGER       REFERENCES categories(id) ON DELETE SET NULL,
  date        DATE          NOT NULL,
  notes       TEXT,
  is_flagged  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS behavior_reports (
  id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month             SMALLINT     NOT NULL CHECK (month BETWEEN 1 AND 12),
  year              SMALLINT     NOT NULL,
  score             SMALLINT     NOT NULL CHECK (score BETWEEN 0 AND 100),
  personality_type  VARCHAR(50)  NOT NULL,
  savings_rate      NUMERIC(6,4) DEFAULT 0,
  impulse_ratio     NUMERIC(6,4) DEFAULT 0,
  consistency_score NUMERIC(6,4) DEFAULT 0,
  volatility_score  NUMERIC(6,4) DEFAULT 0,
  insights          JSONB,
  generated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

CREATE TABLE IF NOT EXISTS alerts (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(20)  NOT NULL CHECK (type IN ('overspend','anomaly','budget','milestone','info')),
  severity    VARCHAR(10)  NOT NULL CHECK (severity IN ('info','warning','danger')),
  title       VARCHAR(150) NOT NULL,
  message     TEXT,
  is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
  expense_id  UUID         REFERENCES expenses(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date   ON expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_type   ON expenses(user_id, type);
CREATE INDEX IF NOT EXISTS idx_expenses_user_cat    ON expenses(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_behavior_user_period ON behavior_reports(user_id, year DESC, month DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_user_unread   ON alerts(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_categories_user      ON categories(user_id);
