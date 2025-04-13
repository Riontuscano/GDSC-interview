const express = require('express');
const router = express.Router();
const { updateUserProfile, getUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Routes
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, authorize('admin'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router; 