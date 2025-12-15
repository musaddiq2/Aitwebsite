// backend/controllers/loginHistory.controller.js
import LoginHistory from '../models/LoginHistory.model.js';
import User from '../models/User.model.js';

// @desc    Get login history for current user
// @route   GET /api/login-history/me
// @access  Private
export const getMyLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({ userId: req.user._id })
      .sort({ loginTime: -1 })
      .limit(50); // Last 50 login attempts

    res.json({
      success: true,
      data: { history }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch login history'
    });
  }
};

// @desc    Get all login history (Admin only)
// @route   GET /api/login-history
// @access  Private/Admin
export const getAllLoginHistory = async (req, res) => {
  try {
    const { userId, status, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate || endDate) {
      filter.loginTime = {};
      if (startDate) {
        filter.loginTime.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.loginTime.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      LoginHistory.find(filter)
        .populate('userId', 'firstName lastName email role')
        .sort({ loginTime: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      LoginHistory.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch login history'
    });
  }
};

// @desc    Get login history for specific user (Admin only)
// @route   GET /api/login-history/user/:userId
// @access  Private/Admin
export const getUserLoginHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const user = await User.findById(userId).select('firstName lastName email role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const history = await LoginHistory.find({ userId })
      .sort({ loginTime: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        user,
        history
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user login history'
    });
  }
};

// @desc    Get login statistics (Admin only)
// @route   GET /api/login-history/stats
// @access  Private/Admin
export const getLoginStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [totalLogins, successfulLogins, failedLogins, uniqueUsers] = await Promise.all([
      LoginHistory.countDocuments({ loginTime: { $gte: startDate } }),
      LoginHistory.countDocuments({ 
        loginTime: { $gte: startDate },
        status: 'Success'
      }),
      LoginHistory.countDocuments({ 
        loginTime: { $gte: startDate },
        status: 'Failed'
      }),
      LoginHistory.distinct('userId', { loginTime: { $gte: startDate } })
    ]);

    // Get daily login counts
    const dailyStats = await LoginHistory.aggregate([
      {
        $match: {
          loginTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$loginTime' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalLogins,
        successfulLogins,
        failedLogins,
        uniqueUsers: uniqueUsers.length,
        successRate: totalLogins > 0 ? ((successfulLogins / totalLogins) * 100).toFixed(2) : 0,
        dailyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch login statistics'
    });
  }
};