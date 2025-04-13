const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * Utility function to check if a user exists and validate credentials
 * For debugging purposes only - not for production use
 */
const checkUserCredentials = async (email) => {
  try {
    // Connect to database if not connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Not connected to database. Please run this script from server.js');
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('==================================');
      console.log('User not found with email:', email);
      console.log('==================================');
      return;
    }
    
    console.log('==================================');
    console.log('User found:');
    console.log('ID:', user._id);
    console.log('Name:', user.firstName, user.lastName);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password hash exists:', !!user.password);
    console.log('==================================');
    
    return user;
  } catch (error) {
    console.error('Error checking user:', error);
  }
};

/**
 * Reset a user's password
 * For debugging purposes only - not for production use
 */
const resetUserPassword = async (email, newPassword) => {
  try {
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      return;
    }
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    console.log('Password reset successfully for:', email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
};

module.exports = {
  checkUserCredentials,
  resetUserPassword
}; 