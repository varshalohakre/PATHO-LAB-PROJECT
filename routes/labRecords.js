const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST: Create a new lab record (test entry)
router.post('/add-test-result', async (req, res) => {
  const { patient_id, test_id, result_value, payment_status } = req.body;
  try {
    const newRecord = await pool.query(
      "INSERT INTO lab_records (patient_id, test_id, result_value, payment_status) VALUES($1, $2, $3, $4) RETURNING *",
      [patient_id, test_id, result_value, payment_status]
    );
    res.status(201).json(newRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add test result" });
  }
});

// GET: Fetch all available tests for the dropdown menu
router.get('/catalog', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test_catalog ORDER BY test_name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Pdf Generator Section
const { generateLabReport } = require('../utils/pdfGenerator');

router.get('/generate-report/:record_id', async (req, res) => {
    const { record_id } = req.params;
    try {
        const result = await pool.query(`
            SELECT p.name, p.age, p.gender, p.phone_number, 
                   t.test_name, t.price, t.normal_range, 
                   l.result_value, l.recorded_at, l.payment_status
            FROM lab_records l
            JOIN patients p ON l.patient_id = p.patient_id
            JOIN test_catalog t ON l.test_id = t.test_id
            WHERE l.record_id = $1`, [record_id]);

        if (result.rows.length === 0) return res.status(404).send("Report not found");

        generateLabReport(res, result.rows[0]);
    } catch (err) {
        res.status(500).send("Error generating report");
    }
});


module.exports = router;