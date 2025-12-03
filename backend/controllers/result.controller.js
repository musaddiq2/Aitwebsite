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

// @desc    Release result
// @route   PUT /api/results/:id/release
// @access  Private/Admin
export const releaseResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      {
        isReleased: true,
        releasedBy: req.user._id,
        releasedAt: new Date()
      },
      { new: true }
    ).populate('userId').populate('examId');

    if (!result) {
      return sendErrorResponse(res, 404, 'Result not found');
    }

    sendSuccessResponse(res, 200, 'Result released successfully', result);
  } catch (error) {
    logger.error('Release result error:', error);
    sendErrorResponse(res, 500, 'Failed to release result');
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
