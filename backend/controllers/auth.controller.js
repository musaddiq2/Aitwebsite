import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import LoginHistory from '../models/LoginHistory.model.js';
import RefreshToken from '../models/RefreshToken.model.js';
import BlacklistedToken from '../models/BlacklistedToken.model.js';
import { generateToken, generateRefreshToken, setTokenCookie, clearTokenCookie } from '../utils/generateToken.js';

// @desc    Register new user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'student',
      ...otherFields
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      ...otherFields,
      status: role === 'admin' ? 'Active' : 'Pending'
    });

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in MongoDB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    // Delete old refresh token if exists
    await RefreshToken.deleteOne({ userId: user._id });
    
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt
    });

    // Set cookies
    setTokenCookie(res, accessToken, refreshToken);

    // Log login history
    await LoginHistory.create({
      userId: user._id,
      userType: user.role,
      loginTime: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      currentLocation: req.originalUrl,
      status: 'Success'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status
        },
        accessToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`Login attempt failed: User not found for email: ${email}`);
      // Don't log to LoginHistory when user doesn't exist (userId is required)
      // Just return invalid credentials for security
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log(`Login attempt for user: ${email}, Role: ${user.role}, Status: ${user.status}`);

    // Check if account is active (handle missing fields gracefully)
    const isDeleted = user.isDeleted || false;
    const userStatus = user.status || 'Active';
    
    if (isDeleted || userStatus === 'Inactive') {
      console.log(`Login attempt failed: Account inactive or deleted for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or deleted'
      });
    }
    
    // Check if status is Pending (students might need activation)
    if (userStatus === 'Pending' && user.role === 'admin') {
      // Allow admin to login even if status is Pending
      console.log(`Admin login with Pending status allowed for ${email}`);
    } else if (userStatus === 'Pending') {
      console.log(`Login attempt failed: Account pending activation for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Account is pending activation. Please contact administrator.'
      });
    }

    // Check password
    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: 'Password not found. Please contact administrator.'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      console.log(`Login attempt failed: Invalid password for ${email}`);
      try {
        await LoginHistory.create({
          userId: user._id,
          userType: user.role || 'student',
          loginTime: new Date(),
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          userAgent: req.get('user-agent') || 'Unknown',
          currentLocation: req.originalUrl || '/api/auth/login',
          status: 'Failed',
          failureReason: 'Invalid password'
        });
      } catch (historyError) {
        // Log but don't fail the request if history creation fails
        console.error('Failed to log login history:', historyError);
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log(`Login successful for user: ${email}`);

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip || req.connection.remoteAddress || 'Unknown';
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in MongoDB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    // Delete old refresh token if exists
    try {
      await RefreshToken.deleteOne({ userId: user._id });
    } catch (tokenError) {
      console.error('Failed to delete old refresh token:', tokenError);
    }
    
    try {
      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt
      });
    } catch (tokenError) {
      console.error('Failed to create refresh token:', tokenError);
      // Continue even if token creation fails
    }

    // Set cookies
    setTokenCookie(res, accessToken, refreshToken);

    // Log successful login
    try {
      await LoginHistory.create({
        userId: user._id,
        userType: user.role || 'student',
        loginTime: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        userAgent: req.get('user-agent') || 'Unknown',
        currentLocation: req.originalUrl || '/api/auth/login',
        status: 'Success'
      });
    } catch (historyError) {
      // Log but don't fail the request if history creation fails
      console.error('Failed to log login history:', historyError);
    }

    // Construct fullName safely
    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          fullName: fullName,
          role: user.role || 'student',
          status: userStatus,
          photo: user.passportPhoto || null
        },
        accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Check if refresh token exists in MongoDB
      const storedTokenDoc = await RefreshToken.findOne({ 
        userId: decoded.id, 
        token: refreshToken 
      });
      
      if (!storedTokenDoc) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new tokens
      const newAccessToken = generateToken(decoded.id);
      const newRefreshToken = generateRefreshToken(decoded.id);

      // Update refresh token in MongoDB
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
      
      storedTokenDoc.token = newRefreshToken;
      storedTokenDoc.expiresAt = expiresAt;
      await storedTokenDoc.save();

      // Set new cookies
      setTokenCookie(res, newAccessToken, newRefreshToken);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Token refresh failed'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (userId) {
      // Remove refresh token from MongoDB
      await RefreshToken.deleteOne({ userId });

      // Blacklist current access token (optional, if you want to invalidate immediately)
      const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
          const expiresAt = new Date(decoded.exp * 1000); // Convert to milliseconds
          if (expiresAt > new Date()) {
            await BlacklistedToken.create({
              token,
              expiresAt
            });
          }
        }
      }
    }

    // Clear cookies
    clearTokenCookie(res);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('courseId', 'courseName duration fees')
      .select('-password');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user'
    });
  }
};

