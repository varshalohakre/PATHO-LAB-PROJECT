// Core Module
const path = require('path');

// External Module
const express = require('express');

const pool = require('./db');


const app = express();

app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table_name');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});