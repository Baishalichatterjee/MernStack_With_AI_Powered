const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).send('Error fetching events.');
  }
});

module.exports = router;