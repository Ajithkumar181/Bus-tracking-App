// controllers/stopController.js
const pool = require('../config/db');

// ➕ Add a stop to a route (Admin)
exports.addStop = async (req, res) => {
  const { route_id, stop_name, latitude, longitude, stop_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO stops (route_id, stop_name, latitude, longitude, stop_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [route_id, stop_name, latitude, longitude, stop_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding stop:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 📥 Get all stops (for admin panel/map)
exports.getAllStops = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stops ORDER BY route_id, stop_order');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stops:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 📍 Get stops by route ID (ordered)
exports.getStopsByRoute = async (req, res) => {
  const { route_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM stops WHERE route_id = $1 ORDER BY stop_order`,
      [route_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stops for route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✏️ Update a stop (Admin)
exports.updateStop = async (req, res) => {
  const { stop_id } = req.params;
  const { stop_name, latitude, longitude, stop_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE stops SET
         stop_name = $1,
         latitude = $2,
         longitude = $3,
         stop_order = $4
       WHERE stop_id = $5
       RETURNING *`,
      [stop_name, latitude, longitude, stop_order, stop_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stop not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating stop:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ❌ Delete a stop
exports.deleteStop = async (req, res) => {
  const { stop_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM stops WHERE stop_id = $1 RETURNING *`,
      [stop_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stop not found' });
    }
    res.json({ message: 'Stop deleted', stop: result.rows[0] });
  } catch (err) {
    console.error('Error deleting stop:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
