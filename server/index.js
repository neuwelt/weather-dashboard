const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database.js');

// Import routes
const locationRoutes = require('./routes/locations.js');
const userRoutes = require('./routes/users.js'); // Add this line

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes); // Add this line

// Initialize database
initDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});