import Exam from '../models/exam/Exam.model.js';
import Question from '../models/exam/Question.model.js';
import Result from '../models/exam/Result.model.js';
import ExamRequest from '../models/ExamRequest.model.js';
import User from '../models/User.model.js';
import { startExamTimer, getRemainingTime, checkExamSession, endExamSession } from '../services/examTimer.service.js';
import ExamSession from '../models/exam/ExamSession.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { isActive, search } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.examTitle = { $regex: search, $options: 'i' };
    }

    const [exams, total] = await Promise.all([
      Exam.find(query)
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Exam.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, exams, pagination);
  } catch (error) {
    logger.error('Get exams error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch exams');
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!exam) {
      return sendErrorResponse(res, 404, 'Exam not found');
    }

    sendSuccessResponse(res, 200, 'Exam retrieved successfully', exam);
  } catch (error) {
    logger.error('Get exam by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch exam');
  }
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req, res) => {
  try {
    const { examTitle, description, duration, totalMarks, passingMarks, instructions, startDate, endDate } = req.body;

    if (!examTitle || !duration || !totalMarks) {
      return sendErrorResponse(res, 400, 'Exam title, duration, and total marks are required');
    }

    const exam = await Exam.create({
      examTitle,
      description,
      duration,
      totalMarks,
      passingMarks: passingMarks || Math.ceil(totalMarks * 0.4),
      instructions,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      createdBy: req.user._id
    });

    sendSuccessResponse(res, 201, 'Exam created successfully', exam);
  } catch (error) {
    logger.error('Create exam error:', error);
    sendErrorResponse(res, 500, 'Failed to create exam');
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return sendErrorResponse(res, 404, 'Exam not found');
    }

    sendSuccessResponse(res, 200, 'Exam updated successfully', exam);
  } catch (error) {
    logger.error('Update exam error:', error);
    sendErrorResponse(res, 500, 'Failed to update exam');
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!exam) {
      return sendErrorResponse(res, 404, 'Exam not found');
    }

    sendSuccessResponse(res, 200, 'Exam deleted successfully');
  } catch (error) {
    logger.error('Delete exam error:', error);
    sendErrorResponse(res, 500, 'Failed to delete exam');
  }
};

// @desc    Start exam
// @route   POST /api/exams/:id/start
// @access  Private/Student
export const startExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const userId = req.user._id;

    // Check if exam exists and is active
    const exam = await Exam.findById(examId);
    if (!exam || !exam.isActive) {
      return sendErrorResponse(res, 404, 'Exam not found or inactive');
    }

    // Check if exam session already exists
    const hasSession = await checkExamSession(userId, examId);
    if (hasSession) {
      return sendErrorResponse(res, 400, 'Exam already started');
    }

    // Get questions for this exam
    const questions = await Question.find({ examId }).select('-correctAnswer');
    
    if (questions.length === 0) {
      return sendErrorResponse(res, 400, 'No questions available for this exam');
    }

    // Shuffle questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    // Start exam timer (creates session in MongoDB)
    const { startTime, endTime } = await startExamTimer(userId, examId, exam.duration);

    // Store questions and initialize answers in MongoDB
    try {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + exam.duration + 5); // 5 min buffer

      await ExamSession.findOneAndUpdate(
        { userId, examId },
        {
          questions: shuffledQuestions,
          answers: {},
          expiresAt
        },
        { new: true }
      );
    } catch (error) {
      logger.error('Failed to store exam data:', error);
      return sendErrorResponse(res, 500, 'Failed to initialize exam session');
    }

    sendSuccessResponse(res, 200, 'Exam started successfully', {
      examId,
      questions: shuffledQuestions,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      startTime,
      endTime
    });
  } catch (error) {
    logger.error('Start exam error:', error);
    sendErrorResponse(res, 500, 'Failed to start exam');
  }
};

// @desc    Submit exam answer
// @route   POST /api/exams/:id/answer
// @access  Private/Student
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const examId = req.params.id;
    const userId = req.user._id;

    // Get exam session
    const session = await ExamSession.findOne({ userId, examId });
    if (!session) {
      return sendErrorResponse(res, 400, 'Exam session not found');
    }

    // Update answers
    const answers = session.answers || {};
    answers[questionId] = answer;

    // Save updated answers
    try {
      session.answers = answers;
      await session.save();
    } catch (error) {
      logger.error('Failed to save answer:', error);
      return sendErrorResponse(res, 500, 'Failed to save answer');
    }

    sendSuccessResponse(res, 200, 'Answer saved successfully');
  } catch (error) {
    logger.error('Submit answer error:', error);
    sendErrorResponse(res, 500, 'Failed to save answer');
  }
};

// @desc    Submit exam
// @route   POST /api/exams/:id/submit
// @access  Private/Student
export const submitExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const userId = req.user._id;

    // Check exam session
    const session = await ExamSession.findOne({ userId, examId });
    if (!session) {
      return sendErrorResponse(res, 400, 'Exam session not found');
    }

    const startTime = new Date(session.startTime);
    const timeTaken = Math.floor((Date.now() - startTime.getTime()) / 1000);

    // Get exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return sendErrorResponse(res, 404, 'Exam not found');
    }

    // Get questions with correct answers
    const questions = await Question.find({ examId });

    // Get student answers from session
    const studentAnswers = session.answers || {};

    // Calculate score
    let score = 0;
    const answerDetails = [];

    questions.forEach(question => {
      const selectedAnswer = studentAnswers[question._id.toString()] || '';
      const isCorrect = selectedAnswer === question.correctAnswer;
      const marksObtained = isCorrect ? question.marks : 0;
      score += marksObtained;

      answerDetails.push({
        questionId: question._id,
        selectedAnswer,
        isCorrect,
        marksObtained
      });
    });

    const percentage = Math.round((score / exam.totalMarks) * 100);
    const status = score >= exam.passingMarks ? 'Passed' : 'Failed';

    // Get user info
    const user = await User.findById(userId);

    // Create result
    const result = await Result.create({
      userId,
      examId,
      studentName: `${user.firstName} ${user.lastName}`,
      score,
      totalMarks: exam.totalMarks,
      percentage,
      status,
      timeTaken,
      answers: answerDetails,
      isReleased: false
    });

    // End exam session (deletes session from MongoDB)
    await endExamSession(userId, examId);

    sendSuccessResponse(res, 200, 'Exam submitted successfully', {
      resultId: result._id,
      score,
      totalMarks: exam.totalMarks,
      percentage,
      status
    });
  } catch (error) {
    logger.error('Submit exam error:', error);
    sendErrorResponse(res, 500, 'Failed to submit exam');
  }
};

// @desc    Get exam timer
// @route   GET /api/exams/:id/timer
// @access  Private/Student
export const getExamTimer = async (req, res) => {
  try {
    const examId = req.params.id;
    const userId = req.user._id;

    const timer = await getRemainingTime(userId, examId);
    
    if (timer.expired) {
      return sendErrorResponse(res, 400, 'Exam time expired');
    }

    sendSuccessResponse(res, 200, 'Timer retrieved successfully', timer);
  } catch (error) {
    logger.error('Get exam timer error:', error);
    sendErrorResponse(res, 500, 'Failed to get exam timer');
  }
};

// @desc    Get exam questions (for taking exam)
// @route   GET /api/exams/:id/questions
// @access  Private/Student
export const getExamQuestions = async (req, res) => {
  try {
    const examId = req.params.id;
    const userId = req.user._id;

    // Check if exam session exists
    const hasSession = await checkExamSession(userId, examId);
    if (!hasSession) {
      return sendErrorResponse(res, 400, 'Exam not started');
    }

    // Get questions from Redis (without correct answers)
    const questionsData = await redisClient.get(`exam:questions:${userId}:${examId}`);
    if (!questionsData) {
      return sendErrorResponse(res, 400, 'Questions not found');
    }

    const questions = JSON.parse(questionsData);

    // Get current answers
    const answersData = await redisClient.get(`exam:answers:${userId}:${examId}`);
    const answers = answersData ? JSON.parse(answersData) : {};

    sendSuccessResponse(res, 200, 'Questions retrieved successfully', {
      questions,
      answers
    });
  } catch (error) {
    logger.error('Get exam questions error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch questions');
  }
};
