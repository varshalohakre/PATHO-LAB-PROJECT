const express = require('express');
const router = express.Router();
const pool = require('../db');

console.log("patients.js file loaded");

/* ---------- HEALTH CHECK ---------- */
router.get('/ping', (req, res) => {
  res.send('patients route alive');
});

/* ---------- GET ALL PATIENTS ---------- */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

/* ---------- GET PATIENT BY ID ---------- */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM patients WHERE patient_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
});

/* ---------- REGISTER PATIENT ---------- */
router.post('/register-patient', async (req, res) => {
  const { name, age, gender, phone_number } = req.body;

  if (!name || !age || !gender || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check duplicate phone
    const existing = await pool.query(
      "SELECT patient_id FROM patients WHERE phone_number = $1",
      [phone_number]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Patient already exists" });
    }

    const result = await pool.query(
      `INSERT INTO patients (name, age, gender, phone_number)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, age, gender, phone_number]
    );

    res.status(201).json({
      message: "Patient registered successfully",
      patient: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not register patient" });
  }
});

/* ---------- PATIENT HISTORY ---------- */
router.get('/history/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    const history = await pool.query(`
      SELECT p.name, l.recorded_at, t.test_name, l.result_value
      FROM patients p
      JOIN lab_records l ON p.patient_id = l.patient_id
      JOIN test_catalog t ON l.test_id = t.test_id
      WHERE p.phone_number = $1
      ORDER BY l.recorded_at DESC
    `, [phone]);

    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
