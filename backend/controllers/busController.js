// controllers/busController.js
const pool = require('../config/db');

// Get all active buses
exports.getAllBuses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buses WHERE is_active = TRUE ORDER BY bus_id');
    console.log("ddd");
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching buses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single bus by ID
exports.getBusById = async (req, res) => {
  const { bus_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM buses WHERE bus_id = $1', [bus_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching bus:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new bus (Admin only)
exports.createBus = async (req, res) => {
  const { bus_number, driver_name, driver_phone, route_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO buses (bus_number, driver_name, driver_phone, route_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [bus_number, driver_name, driver_phone, route_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating bus:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update bus details
exports.updateBus = async (req, res) => {
  const { bus_id } = req.params;
  const { bus_number, driver_name, driver_phone, route_id, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE buses SET
        bus_number = $1,
        driver_name = $2,
        driver_phone = $3,
        route_id = $4,
        is_active = $5
       WHERE bus_id = $6
       RETURNING *`,
      [bus_number, driver_name, driver_phone, route_id, is_active, bus_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating bus:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Soft delete / deactivate a bus
exports.deactivateBus = async (req, res) => {
  const { bus_id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE buses SET is_active = FALSE WHERE bus_id = $1 RETURNING *`,
      [bus_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json({ message: 'Bus deactivated successfully', bus: result.rows[0] });
  } catch (err) {
    console.error('Error deactivating bus:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
