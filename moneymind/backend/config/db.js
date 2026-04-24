const { Pool } = require('pg');

require('dotenv').config();

let rawUrl = process.env.DATABASE_URL || '';

// Strip unsupported params
rawUrl = rawUrl
  .replace('&channel_binding=require', '')
  .replace('channel_binding=require&', '');

const pool = new Pool({
  connectionString: rawUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.query('SELECT NOW()')
  .then(r => console.log('Neon connected at:', r.rows[0].now))
  .catch(err => {
    console.error('DB Error code:', err.code);
    console.error('DB Error message:', err.message);
  });

module.exports = pool;