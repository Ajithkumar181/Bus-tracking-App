// routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.get('/', routeController.getAllRoutes);
router.get('/:route_id', routeController.getRouteById);
router.post('/', routeController.createRoute);
router.put('/:route_id', routeController.updateRoute);
router.delete('/:route_id', routeController.deleteRoute);


module.exports = router;
