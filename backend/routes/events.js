const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  applyForEvent,
  updateApplicationStatus,
  getMyEvents,
} = require('../controllers/eventController');

const router = express.Router();

// Route for user's events
router.get('/my-events', getMyEvents);

// Main routes
router
  .route('/')
  .get(getEvents)
  .post(createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

// Apply for event
router.post('/:id/apply', applyForEvent);

// Update application status
router.put(
  '/:id/applications/:applicationId',
  updateApplicationStatus
);

module.exports = router; 