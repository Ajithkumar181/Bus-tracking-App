// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Database connection (optional test log)
require('./config/db');

// Routes
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
// app.use('/api/locations', require('./routes/locationRoutes'));
 app.use('/api/stops', require('./routes/stopRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('🚍 College Bus Tracker API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
