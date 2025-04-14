const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '/images/default-event.jpg',
    },
    capacity: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    isPast: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    // Reference to users who applied to this event
    applicants: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
          required: true
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false // Not required because we allow non-logged-in users
        },
        userData: {
          firstName: {
            type: String,
            required: true,
            default: 'Guest'
          },
          lastName: {
            type: String,
            required: true,
            default: 'User'
          },
          email: {
            type: String,
            required: true,
            default: 'guest@example.com'
          }
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying on common filters
EventSchema.index({ isPast: 1, isActive: 1 });
EventSchema.index({ date: 1 });

// Virtual for calculating if event is full
EventSchema.virtual('isFull').get(function() {
  if (this.capacity === 0) return false; // Unlimited capacity
  return this.applicants.filter(a => a.status === 'approved').length >= this.capacity;
});

// Set isPast flag automatically based on current date
EventSchema.pre('save', function(next) {
  const now = new Date();
  if (this.date < now) {
    this.isPast = true;
  }
  next();
});

module.exports = mongoose.model('Event', EventSchema); 