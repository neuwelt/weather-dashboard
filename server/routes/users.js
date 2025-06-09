const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, isDatabaseConnected } = require('../database.js');
const router = express.Router();

// Mock users array for when database is not available
let mockUsers = [];
let mockUserId = 1;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, password, and name are required'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        const normalizedEmail = email.toLowerCase();

        if (isDatabaseConnected()) {
            // Database operation
            const client = await pool.connect();

            try {
                // Check if user already exists
                const existingUser = await client.query(
                    'SELECT id FROM users WHERE email = $1',
                    [normalizedEmail]
                );

                if (existingUser.rows.length > 0) {
                    return res.status(400).json({
                        error: 'User with this email already exists'
                    });
                }

                // Hash password
                const saltRounds = 12;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Insert new user
                const result = await client.query(
                    'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name',
                    [normalizedEmail, hashedPassword, name]
                );

                const newUser = result.rows[0];

                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name
                    }
                });

            } finally {
                client.release();
            }
        } else {
            // Mock data operation
            const existingUser = mockUsers.find(u => u.email === normalizedEmail);
            if (existingUser) {
                return res.status(400).json({
                    error: 'User with this email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = {
                id: mockUserId++,
                email: normalizedEmail,
                password: hashedPassword,
                name,
                created_at: new Date()
            };

            mockUsers.push(newUser);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name
                }
            });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const normalizedEmail = email.toLowerCase();

        if (isDatabaseConnected()) {
            // Database operation
            const client = await pool.connect();

            try {
                const result = await client.query(
                    'SELECT id, email, password, name FROM users WHERE email = $1',
                    [normalizedEmail]
                );

                if (result.rows.length === 0) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }

                const user = result.rows[0];
                const isValidPassword = await bcrypt.compare(password, user.password);

                if (!isValidPassword) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }

                // Generate JWT token
                const token = jwt.sign(
                    {
                        userId: user.id,
                        email: user.email
                    },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '7d' }
                );

                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    }
                });

            } finally {
                client.release();
            }
        } else {
            // Mock data operation
            const user = mockUsers.find(u => u.email === normalizedEmail);

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        if (isDatabaseConnected()) {
            const client = await pool.connect();

            try {
                const result = await client.query(
                    'SELECT id, email, name, created_at FROM users WHERE id = $1',
                    [req.user.userId]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json({ user: result.rows[0] });
            } finally {
                client.release();
            }
        } else {
            const user = mockUsers.find(u => u.id === req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    created_at: user.created_at
                }
            });
        }
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile (protected route)
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (isDatabaseConnected()) {
            const client = await pool.connect();

            try {
                const result = await client.query(
                    'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name',
                    [name, req.user.userId]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json({
                    success: true,
                    user: result.rows[0]
                });
            } finally {
                client.release();
            }
        } else {
            const userIndex = mockUsers.findIndex(u => u.id === req.user.userId);
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            mockUsers[userIndex].name = name;

            res.json({
                success: true,
                user: {
                    id: mockUsers[userIndex].id,
                    email: mockUsers[userIndex].email,
                    name: mockUsers[userIndex].name
                }
            });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete user account (protected route)
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        if (isDatabaseConnected()) {
            const client = await pool.connect();

            try {
                // Delete user's saved locations first
                await client.query('DELETE FROM saved_locations WHERE user_id = $1', [req.user.userId]);

                // Delete user
                const result = await client.query('DELETE FROM users WHERE id = $1', [req.user.userId]);

                if (result.rowCount === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json({ success: true, message: 'Account deleted successfully' });
            } finally {
                client.release();
            }
        } else {
            const userIndex = mockUsers.findIndex(u => u.id === req.user.userId);
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            mockUsers.splice(userIndex, 1);
            res.json({ success: true, message: 'Account deleted successfully' });
        }
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;