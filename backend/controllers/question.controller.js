import Question from '../models/exam/Question.model.js';
import Exam from '../models/exam/Exam.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { examId, difficulty, search } = req.query;

    const query = {};
    if (examId) query.examId = examId;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.questionText = { $regex: search, $options: 'i' };
    }

    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate('examId', 'examTitle')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Question.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, questions, pagination);
  } catch (error) {
    logger.error('Get questions error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch questions');
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('examId', 'examTitle');

    if (!question) {
      return sendErrorResponse(res, 404, 'Question not found');
    }

    sendSuccessResponse(res, 200, 'Question retrieved successfully', question);
  } catch (error) {
    logger.error('Get question by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch question');
  }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res) => {
  try {
    const { examId, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks, explanation, difficulty } = req.body;

    if (!examId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return sendErrorResponse(res, 400, 'All question fields are required');
    }

    // Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return sendErrorResponse(res, 404, 'Exam not found');
    }

    const question = await Question.create({
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks: marks || 1,
      explanation,
      difficulty: difficulty || 'Medium'
    });

    // Update exam total questions count
    await Exam.findByIdAndUpdate(examId, {
      $inc: { totalQuestions: 1 }
    });

    sendSuccessResponse(res, 201, 'Question created successfully', question);
  } catch (error) {
    logger.error('Create question error:', error);
    sendErrorResponse(res, 500, 'Failed to create question');
  }
};

// @desc    Create multiple questions
// @route   POST /api/questions/bulk
// @access  Private/Admin
export const createBulkQuestions = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    if (!examId || !questions || !Array.isArray(questions)) {
      return sendErrorResponse(res, 400, 'Exam ID and questions array are required');
    }

    // Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return sendErrorResponse(res, 404, 'Exam not found');
    }

    const createdQuestions = await Question.insertMany(questions);

    // Update exam total questions count
    await Exam.findByIdAndUpdate(examId, {
      $inc: { totalQuestions: createdQuestions.length }
    });

    sendSuccessResponse(res, 201, 'Questions created successfully', createdQuestions);
  } catch (error) {
    logger.error('Create bulk questions error:', error);
    sendErrorResponse(res, 500, 'Failed to create questions');
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('examId');

    if (!question) {
      return sendErrorResponse(res, 404, 'Question not found');
    }

    sendSuccessResponse(res, 200, 'Question updated successfully', question);
  } catch (error) {
    logger.error('Update question error:', error);
    sendErrorResponse(res, 500, 'Failed to update question');
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return sendErrorResponse(res, 404, 'Question not found');
    }

    await Question.findByIdAndDelete(req.params.id);

    // Update exam total questions count
    await Exam.findByIdAndUpdate(question.examId, {
      $inc: { totalQuestions: -1 }
    });

    sendSuccessResponse(res, 200, 'Question deleted successfully');
  } catch (error) {
    logger.error('Delete question error:', error);
    sendErrorResponse(res, 500, 'Failed to delete question');
  }
};
