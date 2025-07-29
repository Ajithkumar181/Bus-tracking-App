// controllers/routeController.js
const pool = require('../config/db');

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routes ORDER BY route_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching routes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
  const { route_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM routes WHERE route_id = $1', [route_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new route (Admin)
exports.createRoute = async (req, res) => {
  const { route_name, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO routes (route_name, description)
       VALUES ($1, $2) RETURNING *`,
      [route_name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing route (Admin)
exports.updateRoute = async (req, res) => {
  const { route_id } = req.params;
  const { route_name, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE routes SET
         route_name = $1,
         description = $2
       WHERE route_id = $3
       RETURNING *`,
      [route_name, description, route_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
