const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST Route to register a new patient
router.post('/register-patient', async (req, res) => {
  const { name, age, gender, phone_number } = req.body;

  try {
    const newPatient = await pool.query(
      "INSERT INTO patients (name, age, gender, phone_number) VALUES($1, $2, $3, $4) RETURNING *",
      [name, age, gender, phone_number]
    );
    
    res.status(201).json({
      message: "Patient registered successfully!",
      patient: newPatient.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not register patient" });
  }
});

// Route to get history by phone number
router.get('/patient-history/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    const history = await pool.query(`
      SELECT p.name, l.recorded_at, t.test_name, l.result_value
      FROM patients p
      JOIN lab_records l ON p.patient_id = l.patient_id
      JOIN test_catalog t ON l.test_id = t.test_id
      WHERE p.phone_number = $1
      ORDER BY l.recorded_at DESC`, 
      [phone]
    );
    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database Error");
  }
});

module.exports = router;