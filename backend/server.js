const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 5001; // Use a different port since 5000 is in use

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());

app.get('/search', async (req, res) => {
  const city = req.query.city;
  try {
    let result;
    if (city) {
      result = await pool.query('SELECT * FROM properties WHERE city = $1', [city]);
    } else {
      result = await pool.query('SELECT * FROM properties');
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 