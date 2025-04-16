const express = require('express');
const cors = require('cors');
const { pool, initDatabase, isDatabaseConnected } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Initialize database
initDatabase();

// Test route
app.get('/', (req, res) => {
  res.send('🌦️ Weather API is running!');
});

// Weather API route
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHER_API_KEY || 'your_default_api_key';
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Weather API error:', err);
    res.status(500).json({ error: 'Weather API failed', details: err.message });
  }
});

// Database-dependent routes
// Save location to database
app.post('/locations', async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({ error: 'Database service unavailable' });
  }
  
  const { city_name, latitude, longitude } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO saved_locations (city_name, latitude, longitude) VALUES ($1, $2, $3) RETURNING *',
      [city_name, latitude, longitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save location' });
  }
});

// Get saved locations
app.get('/locations', async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.json([]);  // Return empty array when DB not available
  }
  
  try {
    const result = await pool.query('SELECT * FROM saved_locations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Delete saved location
app.delete('/locations/:id', async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({ error: 'Database service unavailable' });
  }
  
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM saved_locations WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

