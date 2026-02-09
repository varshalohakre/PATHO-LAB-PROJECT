const express = require('express');
const router = express.Router();
const pool = require('../db');

// PATCH: Update stock count for a specific kit
router.patch('/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { additional_stock } = req.body; 
  try {
    const updatedStock = await pool.query(
      "UPDATE inventory SET stock_count = stock_count + $1 WHERE kit_id = $2 RETURNING *",
      [additional_stock, id]
    );
    res.json(updatedStock.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Inventory Update Failed");
  }
});

module.exports = router;