const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { checkUserCredentials } = require('./utils/debugAuth');

// Load env variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5500;

// Apply rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

// Enable compression for all responses
app.use(compression());

// Parse JSON requests - limit size to prevent abuse
app.use(express.json({ limit: '10kb' }));

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add cache control headers to static assets
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Debug routes (only in development)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/user/:email', async (req, res) => {
    const user = await checkUserCredentials(req.params.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User exists in database' });
  });
}

// Default route
app.get('/', (req, res) => {
  res.send('Unplug API is running');
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB with optimized settings
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unplug', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000,   // 45 seconds
    serverSelectionTimeoutMS: 5000, // 5 seconds
    keepAlive: true,
    keepAliveInitialDelay: 300000 // 5 minutes
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  }); 