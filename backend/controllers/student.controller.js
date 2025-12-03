import User from '../models/User.model.js';
import Attendance from '../models/Attendance.model.js';
import Installment from '../models/Installment.model.js';
import Leave from '../models/Leave.model.js';
import Certificate from '../models/Certificate.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { getAttendanceStats } from '../utils/calculateAttendance.js';
import { getFeesStats } from '../utils/calculateFees.js';
import logger from '../configs/logger.js';

// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private/Student
export const getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get attendance stats for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const attendanceRecords = await Attendance.find({
      studentId,
      attendanceDate: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    const attendanceStats = getAttendanceStats(attendanceRecords);

    // Get fees stats
    const installments = await Installment.find({ studentId });
    const feesStats = getFeesStats(installments);

    // Get exam count
    // TODO: Implement when exam system is ready

    const dashboard = {
      attendance: attendanceStats,
      fees: feesStats,
      exams: { count: 0 } // Placeholder
    };

    sendSuccessResponse(res, 200, 'Dashboard data retrieved successfully', dashboard);
  } catch (error) {
    logger.error('Get student dashboard error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch dashboard data');
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
export const getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .select('-password')
      .populate('courseId');

    sendSuccessResponse(res, 200, 'Profile retrieved successfully', student);
  } catch (error) {
    logger.error('Get profile error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch profile');
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
export const updateProfile = async (req, res) => {
  try {
    // Students can only update certain fields
    const allowedFields = ['phone', 'whatsappNumber', 'address', 'city'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const student = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    sendSuccessResponse(res, 200, 'Profile updated successfully', student);
  } catch (error) {
    logger.error('Update profile error:', error);
    sendErrorResponse(res, 500, 'Failed to update profile');
  }
};

// @desc    Get student attendance
// @route   GET /api/student/attendance
// @access  Private/Student
export const getAttendance = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { startDate, endDate } = req.query;

    const query = { studentId: req.user._id };
    if (startDate && endDate) {
      query.attendanceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .populate('courseId', 'courseName')
        .sort({ attendanceDate: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, attendance, pagination);
  } catch (error) {
    logger.error('Get attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch attendance');
  }
};

// @desc    Get student fees
// @route   GET /api/student/fees
// @access  Private/Student
export const getFees = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    const feesSummary = {
      totalFees: student.fullCourseFees || 0,
      paidAmount: student.feesPaidAmount || 0,
      balanceFees: (student.fullCourseFees || 0) - (student.feesPaidAmount || 0)
    };

    sendSuccessResponse(res, 200, 'Fees summary retrieved successfully', feesSummary);
  } catch (error) {
    logger.error('Get fees error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch fees');
  }
};

// @desc    Get student fees history
// @route   GET /api/student/fees/history
// @access  Private/Student
export const getFeesHistory = async (req, res) => {
  try {
    const installments = await Installment.find({ studentId: req.user._id })
      .sort({ paidDate: -1 });

    sendSuccessResponse(res, 200, 'Fees history retrieved successfully', installments);
  } catch (error) {
    logger.error('Get fees history error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch fees history');
  }
};

// @desc    Get available exams
// @route   GET /api/student/exams
// @access  Private/Student
export const getExams = async (req, res) => {
  try {
    // TODO: Implement when exam system is ready
    sendSuccessResponse(res, 200, 'Exams retrieved successfully', []);
  } catch (error) {
    logger.error('Get exams error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch exams');
  }
};

// @desc    Get exam details
// @route   GET /api/student/exams/:examId
// @access  Private/Student
export const getExamDetails = async (req, res) => {
  try {
    // TODO: Implement when exam system is ready
    sendSuccessResponse(res, 200, 'Exam details retrieved successfully', {});
  } catch (error) {
    logger.error('Get exam details error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch exam details');
  }
};

// @desc    Get student results
// @route   GET /api/student/results
// @access  Private/Student
export const getResults = async (req, res) => {
  try {
    // TODO: Implement when exam system is ready
    sendSuccessResponse(res, 200, 'Results retrieved successfully', []);
  } catch (error) {
    logger.error('Get results error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch results');
  }
};

// @desc    Get result by ID
// @route   GET /api/student/results/:resultId
// @access  Private/Student
export const getResultById = async (req, res) => {
  try {
    // TODO: Implement when exam system is ready
    sendSuccessResponse(res, 200, 'Result retrieved successfully', {});
  } catch (error) {
    logger.error('Get result error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch result');
  }
};

// @desc    Apply for leave
// @route   POST /api/student/leave
// @access  Private/Student
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      studentId: req.user._id,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalDays,
      reason,
      status: 'Pending'
    });

    sendSuccessResponse(res, 201, 'Leave application submitted successfully', leave);
  } catch (error) {
    logger.error('Apply leave error:', error);
    sendErrorResponse(res, 500, 'Failed to submit leave application');
  }
};

// @desc    Get student leaves
// @route   GET /api/student/leave
// @access  Private/Student
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user._id })
      .sort({ appliedDate: -1 });

    sendSuccessResponse(res, 200, 'Leaves retrieved successfully', leaves);
  } catch (error) {
    logger.error('Get leaves error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch leaves');
  }
};

// @desc    Request certificate
// @route   POST /api/student/certificate
// @access  Private/Student
export const requestCertificate = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    if (!student.courseId) {
      return sendErrorResponse(res, 400, 'No course enrolled');
    }

    const certificate = await Certificate.create({
      studentId: req.user._id,
      courseId: student.courseId,
      status: 'Pending'
    });

    sendSuccessResponse(res, 201, 'Certificate request submitted successfully', certificate);
  } catch (error) {
    logger.error('Request certificate error:', error);
    sendErrorResponse(res, 500, 'Failed to submit certificate request');
  }
};

// @desc    Get student certificates
// @route   GET /api/student/certificate
// @access  Private/Student
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id })
      .populate('courseId', 'courseName')
      .sort({ requestDate: -1 });

    sendSuccessResponse(res, 200, 'Certificates retrieved successfully', certificates);
  } catch (error) {
    logger.error('Get certificates error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch certificates');
  }
};
