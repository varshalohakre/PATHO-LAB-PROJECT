const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lab_project_db', // The name you just created in pgAdmin
  password: 'student',
  port: 5432,
});

module.exports = pool;