const express = require('express');
const EventsController = require('../../controllers/labor_scheduling/EventsController');

const router = express.Router();

router.get('/', EventsController.getEvents);

module.exports = router;

