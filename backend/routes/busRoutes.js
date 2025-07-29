// routes/busRoutes.js
const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/', busController.getAllBuses);
router.get('/:bus_id', busController.getBusById);
router.post('/', busController.createBus);
router.put('/:bus_id', busController.updateBus);
router.delete('/:bus_id', busController.deactivateBus);

module.exports = router;
