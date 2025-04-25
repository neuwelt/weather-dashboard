const { Pool } = require('pg');
require('dotenv').config();

// Create a pool with explicit connection details
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

// Global flag to track database connection status
let isConnected = false;

// Test the connection and initialize database
const initDatabase = async () => {
  try {
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
    isConnected = false;
  }
};

const isDatabaseConnected = () => isConnected;

module.exports = { pool, initDatabase, isDatabaseConnected };