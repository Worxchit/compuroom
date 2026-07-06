const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'compuroom',
  password: process.env.PGPASSWORD || 'compuroom',
  database: process.env.PGDATABASE || 'compuroom',
});

module.exports = pool;
