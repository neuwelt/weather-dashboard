const express = require('express');
const { authenticate, requireAuthOrAnonymous } = require('../middleware/auth');
const { pool, isDatabaseConnected } = require('../database');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Mock data for when database is not available
const mockLocations = [];
let mockLocationId = 1;

// Get saved locations
router.get('/', requireAuthOrAnonymous, async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Use mock data if database is not connected
      if (req.user) {
        // Return user-specific mock locations
        const userLocations = mockLocations.filter(loc => loc.user_id === req.user.id);
        return res.json(userLocations);
      } else if (req.anonymousId) {
        // Return anonymous-specific mock locations
        const anonLocations = mockLocations.filter(loc => loc.anonymous_id === req.anonymousId);
        return res.json(anonLocations);
      }
      return res.json([]);
    }
    
    let query;
    let params;
    
    if (req.user) {
      // Get locations for authenticated user
      query = 'SELECT * FROM saved_locations WHERE user_id = $1 ORDER BY created_at DESC';
      params = [req.user.id];
    } else {
      // Get locations for anonymous user
      query = 'SELECT * FROM saved_locations WHERE anonymous_id = $1 ORDER BY created_at DESC';
      params = [req.anonymousId];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Save location
router.post('/', requireAuthOrAnonymous, async (req, res) => {
  try {
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
      
      // Associate with user or anonymous ID
      if (req.user) {
        newLocation.user_id = req.user.id;
      } else {
        newLocation.anonymous_id = req.anonymousId;
      }
      
      mockLocations.push(newLocation);
      return res.status(201).json(newLocation);
    }
    
    let query;
    let params;
    
    if (req.user) {
      // Save location for authenticated user
      query = 'INSERT INTO saved_locations (city_name, latitude, longitude, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
      params = [city_name, latitude, longitude, req.user.id];
    } else {
      // Save location for anonymous user
      query = 'INSERT INTO saved_locations (city_name, latitude, longitude, anonymous_id) VALUES ($1, $2, $3, $4) RETURNING *';
      params = [city_name, latitude, longitude, req.anonymousId];
    }
    
    const result = await pool.query(query, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

// Delete location
router.delete('/:id', requireAuthOrAnonymous, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isDatabaseConnected()) {
      // Use mock data if database is not connected
      const index = mockLocations.findIndex(loc => {
        if (req.user) {
          return loc.id === parseInt(id) && loc.user_id === req.user.id;
        } else {
          return loc.id === parseInt(id) && loc.anonymous_id === req.anonymousId;
        }
      });
      
      if (index !== -1) {
        mockLocations.splice(index, 1);
      }
      return res.status(204).send();
    }
    
    let query;
    let params;
    
    if (req.user) {
      // Delete location for authenticated user
      query = 'DELETE FROM saved_locations WHERE id = $1 AND user_id = $2';
      params = [id, req.user.id];
    } else {
      // Delete location for anonymous user
      query = 'DELETE FROM saved_locations WHERE id = $1 AND anonymous_id = $2';
      params = [id, req.anonymousId];
    }
    
    await pool.query(query, params);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting location:', err);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

// Transfer anonymous locations to user account
router.post('/transfer', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { anonymousId } = req.body;
    
    if (!anonymousId) {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }
    
    if (!isDatabaseConnected()) {
      // Use mock data if database is not connected
      const anonLocations = mockLocations.filter(loc => loc.anonymous_id === anonymousId);
      
      anonLocations.forEach(loc => {
        loc.user_id = req.user.id;
        delete loc.anonymous_id;
      });
      
      return res.json({ message: 'Locations transferred successfully', count: anonLocations.length });
    }
    
    // Update locations in database
    const result = await pool.query(
      'UPDATE saved_locations SET user_id = $1, anonymous_id = NULL WHERE anonymous_id = $2 RETURNING *',
      [req.user.id, anonymousId]
    );
    
    res.json({ 
      message: 'Locations transferred successfully', 
      count: result.rowCount 
    });
  } catch (err) {
    console.error('Error transferring locations:', err);
    res.status(500).json({ error: 'Failed to transfer locations' });
  }
});

module.exports = router;
