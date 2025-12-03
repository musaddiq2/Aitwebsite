import Leave from '../models/Leave.model.js';
import User from '../models/User.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { getDaysBetween } from '../utils/dateUtils.js';
import logger from '../configs/logger.js';

// @desc    Get all leaves
// @route   GET /api/leaves
// @access  Private
export const getLeaves = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { studentId, status, startDate, endDate } = req.query;

    const query = {};
    
    // If student role, only show their leaves
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (status) query.status = status;
    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .populate('studentId', 'firstName lastName email rollNo')
        .populate('approvedBy', 'firstName lastName')
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(limit),
      Leave.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, leaves, pagination);
  } catch (error) {
    logger.error('Get leaves error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch leaves');
  }
};

// @desc    Get leave by ID
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('studentId')
      .populate('approvedBy');

    if (!leave) {
      return sendErrorResponse(res, 404, 'Leave not found');
    }

    // Check if user has access
    if (req.user.role === 'student' && leave.studentId._id.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    sendSuccessResponse(res, 200, 'Leave retrieved successfully', leave);
  } catch (error) {
    logger.error('Get leave by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch leave');
  }
};

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private/Student
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return sendErrorResponse(res, 400, 'All fields are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return sendErrorResponse(res, 400, 'Start date must be before end date');
    }

    if (start < new Date().setHours(0, 0, 0, 0)) {
      return sendErrorResponse(res, 400, 'Start date cannot be in the past');
    }

    const totalDays = getDaysBetween(start, end) + 1;

    const leave = await Leave.create({
      studentId: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
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

// @desc    Approve leave
// @route   PUT /api/leaves/:id/approve
// @access  Private/Admin
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy: req.user._id,
        approvedDate: new Date()
      },
      { new: true }
    ).populate('studentId');

    if (!leave) {
      return sendErrorResponse(res, 404, 'Leave not found');
    }

    sendSuccessResponse(res, 200, 'Leave approved successfully', leave);
  } catch (error) {
    logger.error('Approve leave error:', error);
    sendErrorResponse(res, 500, 'Failed to approve leave');
  }
};

// @desc    Reject leave
// @route   PUT /api/leaves/:id/reject
// @access  Private/Admin
export const rejectLeave = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        approvedBy: req.user._id,
        approvedDate: new Date(),
        rejectionReason: rejectionReason || 'Leave application rejected'
      },
      { new: true }
    ).populate('studentId');

    if (!leave) {
      return sendErrorResponse(res, 404, 'Leave not found');
    }

    sendSuccessResponse(res, 200, 'Leave rejected successfully', leave);
  } catch (error) {
    logger.error('Reject leave error:', error);
    sendErrorResponse(res, 500, 'Failed to reject leave');
  }
};

// @desc    Update leave
// @route   PUT /api/leaves/:id
// @access  Private/Student (only pending leaves)
export const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return sendErrorResponse(res, 404, 'Leave not found');
    }

    // Only student can update their own pending leaves
    if (leave.studentId.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    if (leave.status !== 'Pending') {
      return sendErrorResponse(res, 400, 'Only pending leaves can be updated');
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    sendSuccessResponse(res, 200, 'Leave updated successfully', updatedLeave);
  } catch (error) {
    logger.error('Update leave error:', error);
    sendErrorResponse(res, 500, 'Failed to update leave');
  }
};

// @desc    Delete leave
// @route   DELETE /api/leaves/:id
// @access  Private/Student (only pending leaves)
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return sendErrorResponse(res, 404, 'Leave not found');
    }

    // Only student can delete their own pending leaves
    if (leave.studentId.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    if (leave.status !== 'Pending') {
      return sendErrorResponse(res, 400, 'Only pending leaves can be deleted');
    }

    await Leave.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, 200, 'Leave deleted successfully');
  } catch (error) {
    logger.error('Delete leave error:', error);
    sendErrorResponse(res, 500, 'Failed to delete leave');
  }
};
