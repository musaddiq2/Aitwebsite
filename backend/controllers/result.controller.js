import mongoose from 'mongoose';
import Result from '../models/exam/Result.model.js';
import Exam from '../models/exam/Exam.model.js';
import User from '../models/User.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get all results
// @route   GET /api/results
// @access  Private
export const getResults = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { userId, examId, status, isReleased } = req.query;

    const query = {};
    
    // If student role, only show their results
    if (req.user.role === 'student') {
      query.userId = req.user._id;
      query.isReleased = true; // Only show released results
    } else {
      if (userId) query.userId = userId;
      if (isReleased !== undefined) query.isReleased = isReleased === 'true';
    }

    if (examId) query.examId = examId;
    if (status) query.status = status;

    const [results, total] = await Promise.all([
      Result.find(query)
        .populate('userId', 'firstName lastName email rollNo')
        .populate('examId', 'examTitle totalMarks passingMarks')
        .populate('releasedBy', 'firstName lastName')
        .sort({ examDate: -1 })
        .skip(skip)
        .limit(limit),
      Result.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, results, pagination);
  } catch (error) {
    logger.error('Get results error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch results');
  }
};

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('userId', 'firstName lastName email rollNo')
      .populate('examId', 'examTitle totalMarks passingMarks')
      .populate('answers.questionId')
      .populate('releasedBy', 'firstName lastName');

    if (!result) {
      return sendErrorResponse(res, 404, 'Result not found');
    }

    // Check if user has access
    if (req.user.role === 'student') {
      if (result.userId._id.toString() !== req.user._id.toString()) {
        return sendErrorResponse(res, 403, 'Access denied');
      }
      if (!result.isReleased) {
        return sendErrorResponse(res, 403, 'Result not released yet');
      }
    }

    sendSuccessResponse(res, 200, 'Result retrieved successfully', result);
  } catch (error) {
    logger.error('Get result by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch result');
  }
};

// @desc    Release or unrelease a result (toggle)
// @route   PATCH /api/results/:id/release
// @access  Private/Admin
export const releaseResult = async (req, res) => {
  try {
    const { isReleased } = req.body;

    // Validate that isReleased is a boolean
    if (typeof isReleased !== 'boolean') {
      return sendErrorResponse(res, 400, 'isReleased field must be true or false');
    }

    const updateData = {
      isReleased,
      releasedBy: isReleased ? req.user._id : null,
      releasedAt: isReleased ? new Date() : null
    };

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName')
      .populate('examId', 'examTitle');

    if (!result) {
      return sendErrorResponse(res, 404, 'Result not found');
    }

    sendSuccessResponse(
      res,
      200,
      `Result ${isReleased ? 'released' : 'unreleased'} successfully`,
      result
    );
  } catch (error) {
    logger.error('Release/Unrelease result error:', error);
    sendErrorResponse(res, 500, 'Failed to update result release status');
  }
};

// @desc    Get exam statistics
// @route   GET /api/results/exam/:examId/stats
// @access  Private/Admin
export const getExamStats = async (req, res) => {
  try {
    const examId = req.params.examId;

    const stats = await Result.aggregate([
      { $match: { examId: new mongoose.Types.ObjectId(examId) } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentage' },
          passed: { $sum: { $cond: [{ $eq: ['$status', 'Passed'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] } },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' }
        }
      }
    ]);

    sendSuccessResponse(res, 200, 'Exam statistics retrieved successfully', stats[0] || {});
  } catch (error) {
    logger.error('Get exam stats error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch exam statistics');
  }
};

