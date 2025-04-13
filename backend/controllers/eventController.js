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
    console.log('Apply for event request received:', {
      eventId: req.params.id,
      userId: req.body.userId
    });
    
    // First, check if the userId exists in the User collection
    // If not, we'll still allow the application but use a placeholder user object
    let userId = req.body.userId || '661037f9f5aee68b6cb9ed9f'; // Use a default user ID if not provided
    
    // Get userData if provided in the request
    const userData = req.body.userData || {
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com'
    };
    
    console.log('Processing application with user ID:', userId);
    console.log('User data received:', userData);
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      console.log('Event not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if event is past
    if (event.isPast) {
      console.log('Cannot apply for past event');
      return res.status(400).json({
        success: false,
        message: 'Cannot apply for past events',
      });
    }
    
    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      console.log('Registration deadline has passed');
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
      });
    }
    
    console.log('Using user ID for application:', userId);
    
    // Check if user already applied - handle both string IDs and object IDs
    const alreadyApplied = event.applicants.find(
      applicant => {
        if (!applicant.user) return false;
        if (typeof applicant.user === 'string' || applicant.user instanceof String) {
          return applicant.user === userId;
        }
        return applicant.user.toString() === userId.toString();
      }
    );
    
    if (alreadyApplied) {
      console.log('User already applied to this event');
      return res.status(400).json({
        success: false,
        message: 'This user has already applied for this event',
      });
    }
    
    // Add user to applicants list
    const newApplication = {
      _id: new mongoose.Types.ObjectId(), // Generate a new MongoDB ObjectId for the application
      user: userId,
      userData: {  // Store user data directly in the application object
        firstName: userData.firstName || 'Guest',
        lastName: userData.lastName || 'User',
        email: userData.email || 'guest@example.com'
      },
      status: 'pending',
      appliedAt: Date.now(),
    };
    
    event.applicants.push(newApplication);
    console.log('Added new application:', newApplication);
    
    const savedEvent = await event.save();
    console.log('Event saved with new application. Total applicants:', savedEvent.applicants.length);
    
    try {
      // Fetch the event again with populated fields to return
      const populatedEvent = await Event.findById(req.params.id)
        .populate('createdBy', 'firstName lastName')
        .populate('applicants.user', 'firstName lastName email');
      
      res.status(200).json({
        success: true,
        message: 'Application submitted successfully',
        data: populatedEvent,
      });
    } catch (populateError) {
      // If population fails, still return success with the unpopulated event
      console.error('Error populating event data:', populateError);
      res.status(200).json({
        success: true,
        message: 'Application submitted successfully, but user data could not be loaded',
        data: savedEvent,
      });
    }
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
    const { status } = req.body;
    console.log(`Updating application status for event ${req.params.id}, application ${req.params.applicationId} to ${status}`);
    
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (approved, rejected, or pending)',
      });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Find the application by its _id
    const applicationIndex = event.applicants.findIndex(app => {
      if (!app._id) return false;
      
      // Handle cases where _id is a string or ObjectId
      if (typeof app._id === 'string' || app._id instanceof String) {
        return app._id === req.params.applicationId;
      } 
      return app._id.toString() === req.params.applicationId;
    });
    
    if (applicationIndex === -1) {
      console.log('Application not found with ID:', req.params.applicationId);
      console.log('Available applications:', event.applicants.map(app => ({
        applicationId: app._id && (typeof app._id === 'string' ? app._id : app._id.toString()),
        userId: app.user && (typeof app.user === 'string' ? app.user : app.user.toString()),
        status: app.status
      })));
      
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }
    
    console.log(`Found application at index ${applicationIndex}, changing status from ${event.applicants[applicationIndex].status} to ${status}`);
    
    // Update the status
    event.applicants[applicationIndex].status = status;
    const savedEvent = await event.save();
    
    console.log('Application status updated successfully');
    
    try {
      // Return populated event data
      const populatedEvent = await Event.findById(req.params.id)
        .populate('createdBy', 'firstName lastName')
        .populate('applicants.user', 'firstName lastName email');
      
      res.status(200).json({
        success: true,
        message: `Application ${status} successfully`,
        data: populatedEvent,
      });
    } catch (populateError) {
      // If population fails, still return success with the unpopulated event
      console.error('Error populating event data:', populateError);
      res.status(200).json({
        success: true,
        message: `Application ${status} successfully, but user data could not be loaded`,
        data: savedEvent,
      });
    }
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