
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query(`
    CREATE TABLE IF NOT EXISTS saved_locations (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        city_name TEXT NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )
`).then(() => console.log("Database ready"))
  .catch(err => console.error(err));

module.exports = pool;