const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Mock data for when database is not available
const mockLocations = [];
let mockLocationId = 1;

// Create a pool with explicit connection details
let pool;
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

try {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
  });
} catch (err) {
  console.error('Error creating pool:', err.message);
}

// Global flag to track database connection status
let isConnected = false;

// Test the connection and initialize database
const initDatabase = async () => {
  try {
    if (!pool) {
      console.log('Database pool not initialized, using mock data');
      return;
    }
    
    // Test connection
    const client = await pool.connect();
    console.log('PostgreSQL connected: ', client.database);
    isConnected = true;
    
    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_locations (
        id SERIAL PRIMARY KEY,
        city_name TEXT NOT NULL,
        latitude FLOAT,
        longitude FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database tables initialized');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
    console.log('Continuing with mock data for locations');
    isConnected = false;
  }
};

const isDatabaseConnected = () => isConnected;

module.exports = { pool, initDatabase, isDatabaseConnected };
