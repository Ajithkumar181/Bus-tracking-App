// routes/busLocationRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/busLocationController');

router.post('/', controller.createBusLocation);
router.get('/latest/:busId', controller.getLatestBusLocation);
router.get('/history/:busId', controller.getBusLocationHistory);
router.get('/plot/:busId', controller.getCoordinatesForPlotting);
router.get('/delays/:busId', controller.getBusDelayReport);


// New endpoint for admin
router.get('/date/:busId', controller.getCoordinatesByDate);
router.delete('/date/:busId', controller.deleteCoordinatesByDate);

module.exports = router;
