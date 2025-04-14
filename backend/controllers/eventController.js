const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Create a new event
// @route   POST /api/events
// @access  Public
const createEvent = async (req, res, next) => {
  try {
    // Hardcode the admin ID (you can set this to your admin user's ID)
    req.body.createdBy = '6610372df5aee68b6cb9ed9e'; // Replace with your admin ID
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    console.log('Get events request received with query:', req.query);
    
    // Basic filtering
    const filter = {};
    
    // Filter past events if specified
    if (req.query.past === 'true') {
      filter.isPast = true;
    } else if (req.query.past === 'false') {
      filter.isPast = false;
    }
    
    // Only return active events by default
    if (req.query.showAll !== 'true') {
      filter.isActive = true;
    }
    
    console.log('Applied filters:', filter);
    
    const events = await Event.find(filter)
      .sort({ date: req.query.past === 'true' ? -1 : 1 }) // Sort by date (descending for past events)
      .populate('createdBy', 'firstName lastName')
      .populate('applicants.user', 'firstName lastName email');
    
    console.log(`Found ${events.length} events`);
    
    // Log the number of applicants for each event
    events.forEach(event => {
      console.log(`Event ID ${event._id} (${event.title}) has ${event.applicants.length} applicants`);
    });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('applicants.user', 'firstName lastName email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Public
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Public
const deleteEvent = async (req, res, next) => {
  try {
    console.log(`Attempting to delete event with ID: ${req.params.id}`);
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      console.log(`Event with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    console.log(`Found event to delete: "${event.title}" (${event._id})`);
    await event.deleteOne();
    console.log(`Event successfully deleted from database`);
    
    res.status(200).json({
      success: true,
      message: 'Event successfully deleted',
      data: {},
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    next(error);
  }
};

// @desc    Apply for an event
// @route   POST /api/events/:id/apply
// @access  Public
const applyForEvent = async (req, res, next) => {
  try {
    console.log('Apply request received:', req.body);
    
    // Get the event
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if event is past
    if (event.isPast) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply for past events'
      });
    }
    
    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }
    
    // Get user data from request
    const userData = {
      firstName: req.body.userData?.firstName || 'Guest',
      lastName: req.body.userData?.lastName || 'User',
      email: req.body.userData?.email || 'guest@example.com'
    };
    
    // Create a new application
    const newApplication = {
      _id: new mongoose.Types.ObjectId(),
      userData: userData,
      user: req.body.userId || null,
      status: 'pending',
      appliedAt: new Date()
    };
    
    console.log('Creating application with data:', newApplication);
    
    // Check if user has already applied
    const hasApplied = event.applicants.some(app => {
      // Check by user ID if provided
      if (req.body.userId && app.user) {
        return app.user.toString() === req.body.userId.toString();
      }
      
      // Or check by email
      if (app.userData && app.userData.email === userData.email) {
        return true;
      }
      
      return false;
    });
    
    if (hasApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this event'
      });
    }
    
    // Add application to event
    event.applicants.push(newApplication);
    
    // Save event
    await event.save();
    
    console.log('Application added successfully');
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: newApplication._id,
        status: 'pending'
      }
    });
    
  } catch (error) {
    console.error('Error in applyForEvent:', error);
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/events/:id/applications/:applicationId
// @access  Public
const updateApplicationStatus = async (req, res, next) => {
  try {
    console.log('Updating application status:', {
      eventId: req.params.id,
      applicationId: req.params.applicationId,
      status: req.body.status
    });
    
    // Validate requested status
    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be pending, approved, or rejected'
      });
    }
    
    // Find the event
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Find the application within the event
    const applicationIndex = event.applicants.findIndex(
      app => app._id.toString() === req.params.applicationId
    );
    
    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Application not found for this event'
      });
    }
    
    // Update the application status
    event.applicants[applicationIndex].status = req.body.status;
    
    // Save the event with updated application
    await event.save();
    
    console.log('Application status updated successfully');
    
    // Return success with updated application data
    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: {
        eventId: event._id,
        applicationId: event.applicants[applicationIndex]._id,
        status: event.applicants[applicationIndex].status
      }
    });
    
  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    next(error);
  }
};

// @desc    Get events for current user
// @route   GET /api/events/my-events
// @access  Public
const getMyEvents = async (req, res, next) => {
  try {
    // Since we don't have user authentication, get user ID from query
    const userId = req.query.userId || '661037f9f5aee68b6cb9ed9f'; // Use a default user ID if not provided
    
    // Find all events that the user has applied to
    const events = await Event.find({
      'applicants.user': userId,
    }).populate('createdBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  applyForEvent,
  updateApplicationStatus,
  getMyEvents,
}; 