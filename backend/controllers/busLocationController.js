// controllers/busLocationController.js
const pool = require('../config/db');

exports.createBusLocation = async (req, res) => {
  const { bus_id, latitude, longitude, speed } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bus_locations (bus_id, latitude, longitude, speed)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [bus_id, latitude, longitude, speed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestBusLocation = async (req, res) => {
  const { busId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM bus_locations
       WHERE bus_id = $1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [busId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBusLocationHistory = async (req, res) => {
  const { busId } = req.params;
  const { start, end } = req.query;

  // Fallback: default to last 1 hour
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const startTime = start ? new Date(start) : oneHourAgo;
  const endTime = end ? new Date(end) : now;

  try {
    const result = await pool.query(
      `SELECT * FROM bus_locations
       WHERE bus_id = $1
         AND timestamp BETWEEN $2 AND $3
       ORDER BY timestamp ASC`,
      [busId, startTime, endTime]
    );

    res.json({
      from: startTime,
      to: endTime,
      total: result.rowCount,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCoordinatesForPlotting = async (req, res) => {
  const { busId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Query parameter "date" is required (format: YYYY-MM-DD)' });
  }

  try {
    const result = await pool.query(
      `SELECT latitude, longitude, timestamp
       FROM bus_locations
       WHERE bus_id = $1 AND timestamp::date = $2
       ORDER BY timestamp ASC`,
      [busId, date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No coordinates found for this bus on the specified date.' });
    }

    res.json({
      bus_id: busId,
      date: date,
      coordinates: result.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBusDelayReport = async (req, res) => {
  const { busId } = req.params;
  try {
    const result = await pool.query(
      `SELECT timestamp, speed FROM bus_locations
       WHERE bus_id = $1
       ORDER BY timestamp ASC`,
      [busId]
    );

    const delays = [];
    const locations = result.rows;

    for (let i = 1; i < locations.length; i++) {
      const diff = new Date(locations[i].timestamp) - new Date(locations[i - 1].timestamp);
      if (diff > 10 * 60 * 1000) { // >10 minutes gap
        delays.push({
          start: locations[i - 1].timestamp,
          end: locations[i].timestamp,
          delayMinutes: diff / (60 * 1000)
        });
      }
    }

    res.json({ delays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controllers/busLocationController.js

exports.getCoordinatesByDate = async (req, res) => {
  const { busId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Query parameter "date" is required (format: YYYY-MM-DD)' });
  }

  try {
    const result = await pool.query(
      `
      SELECT latitude, longitude, timestamp
      FROM bus_locations
      WHERE bus_id = $1
        AND timestamp::date = $2
      ORDER BY timestamp ASC
      `,
      [busId, date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No coordinates found for the given bus and date.' });
    }

    res.json({
      bus_id: busId,
      date: date,
      coordinates: result.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/busLocationController.js

exports.deleteCoordinatesByDate = async (req, res) => {
  const { busId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Query parameter "date" is required (format: YYYY-MM-DD)' });
  }

  try {
    // Check how many records will be deleted
    const check = await pool.query(
      `SELECT COUNT(*) FROM bus_locations WHERE bus_id = $1 AND timestamp::date = $2`,
      [busId, date]
    );

    const count = parseInt(check.rows[0].count);

    if (count === 0) {
      return res.status(404).json({ message: 'No records found to delete for the specified bus and date.' });
    }

    // Proceed to delete
    await pool.query(
      `DELETE FROM bus_locations WHERE bus_id = $1 AND timestamp::date = $2`,
      [busId, date]
    );

    res.json({
      message: `Successfully deleted ${count} location record(s) for Bus ${busId} on ${date}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


