// config/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Optional: Test the connection
pool.connect()
  .then(() => console.log('✅ PostgreSQL connected manually using .env values'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err.stack));

module.exports = pool;
