import { 
  getDashboardStats as getDashboardStatsService, 
  getAttendanceAnalytics as getAttendanceAnalyticsService, 
  getFeesAnalytics as getFeesAnalyticsService 
} from '../services/analytics.service.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';
import logger from '../configs/logger.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStatsService();
    sendSuccessResponse(res, 200, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch dashboard stats');
  }
};

// @desc    Get attendance analytics
// @route   GET /api/admin/analytics/attendance
// @access  Private/Admin
export const getAttendanceAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return sendErrorResponse(res, 400, 'Start date and end date are required');
    }

    const analytics = await getAttendanceAnalyticsService(startDate, endDate);
    sendSuccessResponse(res, 200, 'Attendance analytics retrieved successfully', analytics);
  } catch (error) {
    logger.error('Get attendance analytics error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch attendance analytics');
  }
};

// @desc    Get fees analytics
// @route   GET /api/admin/analytics/fees
// @access  Private/Admin
export const getFeesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return sendErrorResponse(res, 400, 'Start date and end date are required');
    }

    const analytics = await getFeesAnalyticsService(startDate, endDate);
    sendSuccessResponse(res, 200, 'Fees analytics retrieved successfully', analytics);
  } catch (error) {
    logger.error('Get fees analytics error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch fees analytics');
  }
};
