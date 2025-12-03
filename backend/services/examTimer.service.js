import ExamSession from '../models/exam/ExamSession.model.js';
import logger from '../configs/logger.js';

// Store exam session with timer
export const startExamTimer = async (userId, examId, durationMinutes) => {
  try {
    const startTime = Date.now();
    const endTime = startTime + (durationMinutes * 60 * 1000);
    const expiresAt = new Date(endTime + (60 * 1000)); // Add 1 minute buffer

    // Delete old session if exists
    await ExamSession.deleteOne({ userId, examId });

    await ExamSession.create({
      userId,
      examId,
      startTime,
      endTime,
      durationMinutes,
      expiresAt
    });

    return { startTime, endTime };
  } catch (error) {
    logger.error('Exam timer start error:', error);
    throw error;
  }
};

// Get remaining time
export const getRemainingTime = async (userId, examId) => {
  try {
    const session = await ExamSession.findOne({ userId, examId });

    if (!session) {
      return { remaining: 0, expired: true };
    }

    const now = Date.now();
    const remaining = Math.max(0, Math.floor((session.endTime - now) / 1000));

    return {
      remaining,
      expired: remaining === 0,
      startTime: session.startTime,
      endTime: session.endTime
    };
  } catch (error) {
    logger.error('Get remaining time error:', error);
    return { remaining: 0, expired: true };
  }
};

// Check if exam session exists
export const checkExamSession = async (userId, examId) => {
  try {
    const session = await ExamSession.findOne({ userId, examId });
    return !!session;
  } catch (error) {
    logger.error('Check exam session error:', error);
    return false;
  }
};

// End exam session
export const endExamSession = async (userId, examId) => {
  try {
    await ExamSession.deleteOne({ userId, examId });
    return true;
  } catch (error) {
    logger.error('End exam session error:', error);
    return false;
  }
};

