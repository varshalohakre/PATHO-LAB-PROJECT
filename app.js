// app.js
const express = require('express');
const app = express();
const cors = require('cors');

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Import Route Files
const patientRoutes = require('./routes/patients');
const recordRoutes = require('./routes/labRecords');
const inventoryRoutes = require('./routes/inventory');
const financeRoutes = require('./routes/finance');

// 3. Define the URL "Prefixes"
// This means every patient link will start with /api/patients
app.use('/api/patients', patientRoutes); 
app.use('/api/records', recordRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/finance', financeRoutes);

// 4. Default Home Route
app.get('/', (req, res) => {
  res.send('Purva Clinical Lab API is Running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Engine started on port ${PORT}`));