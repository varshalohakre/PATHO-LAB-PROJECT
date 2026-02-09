const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET: Aggregate income data for the dashboard
router.get('/financial-summary', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        TO_CHAR(billed_at, 'Mon DD') as date_label, 
        SUM(total_amount) as daily_total
      FROM bills 
      GROUP BY billed_at 
      ORDER BY billed_at DESC 
      LIMIT 7
    `);
    res.json(stats.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Finance Data Error");
  }
});

module.exports = router;