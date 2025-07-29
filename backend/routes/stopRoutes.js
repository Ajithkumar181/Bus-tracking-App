// routes/stopRoutes.js
const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');

// All stops
router.get('/', stopController.getAllStops);

// By route
router.get('/route/:route_id', stopController.getStopsByRoute);

// Add new stop
router.post('/', stopController.addStop);

// Update stop
router.put('/:stop_id', stopController.updateStop);

// Delete stop
router.delete('/:stop_id', stopController.deleteStop);

module.exports = router;
