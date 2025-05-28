const express = require('express');
const cors = require('cors');
const { pool, initDatabase, isDatabaseConnected } = require('./database'); // Import the pool from database.js
require('dotenv').config();
const path = require('path');

console.log('Loading .env from:', path.resolve(__dirname, '../.env'));
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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

// Air Pollution API route
app.get('/air-pollution/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const apiKey = process.env.WEATHER_API_KEY || 'your_default_api_key';
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
     );
    
    if (!response.ok) {
      throw new Error(`Air Pollution API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Air Pollution API error:', err);
    res.status(500).json({ error: 'Air Pollution API failed', details: err.message });
  }
});

// Forecast API route - Using 5-day/3-hour forecast API (free tier)
app.get('/forecast/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const apiKey = process.env.WEATHER_API_KEY || 'your_default_api_key';
  
  try {
    // Using the 5 day / 3 hour forecast API which is available in the free tier
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
     );
    
    if (!response.ok) {
      throw new Error(`Forecast API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process the data to get daily forecasts (one per day)
    const dailyForecasts = processForecastData(data);
    
    res.json({ daily: dailyForecasts });
  } catch (err) {
    console.error('Forecast API error:', err);
    res.status(500).json({ error: 'Forecast API failed', details: err.message });
  }
});

// Helper function to process the 3-hour forecast data into daily forecasts
function processForecastData(data) {
  const dailyMap = new Map();
  
  // Group forecasts by day
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!dailyMap.has(day)) {
      dailyMap.set(day, {
        dt: item.dt,
        temp: { day: item.main.temp },
        feels_like: item.main.feels_like,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        weather: item.weather,
        wind_speed: item.wind.speed,
        clouds: item.clouds.all
      });
    }
  });
  
  // Convert map to array
  return Array.from(dailyMap.values());
}

// Mock data for when database is not available
const mockLocations = [];
let mockLocationId = 1;

// Database-dependent routes
// Save location to database
app.post('/locations', async (req, res) => {
  const { city_name, latitude, longitude } = req.body;
  
  if (!isDatabaseConnected()) {
    // Use mock data if database is not connected
    const newLocation = {
      id: mockLocationId++,
      city_name,
      latitude,
      longitude,
      created_at: new Date().toISOString()
    };
    mockLocations.push(newLocation);
    return res.status(201).json(newLocation);
  }
  
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
    return res.json(mockLocations);  // Return mock data when DB not available
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
  const { id } = req.params;
  
  if (!isDatabaseConnected()) {
    // Remove from mock data if database is not connected
    const index = mockLocations.findIndex(loc => loc.id === parseInt(id));
    if (index !== -1) {
      mockLocations.splice(index, 1);
    }
    return res.status(204).send();
  }
  
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
