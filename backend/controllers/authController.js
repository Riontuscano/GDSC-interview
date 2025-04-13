const User = require('../models/User');
const { generateToken } = require('../utils/auth');


const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      college,
      year,
      branch,
      interests,
    } = req.body;


    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }


    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      college,
      year,
      branch,
      interests,
    });


    const token = generateToken(user._id);


    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }
    
    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Login attempt with email:', normalizedEmail);
    
    // Find user with the email (use correct query syntax)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('User found, comparing password');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('Login successful');
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
}; 