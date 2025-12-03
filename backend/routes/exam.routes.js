import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as examController from '../controllers/exam.controller.js';

const router = express.Router();

// All exam routes require authentication
router.use(protect);

// Exam routes
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);
router.post('/', adminOnly, examController.createExam);
router.put('/:id', adminOnly, examController.updateExam);
router.delete('/:id', adminOnly, examController.deleteExam);

// Student exam routes
router.post('/:id/start', authorize('student'), examController.startExam);
router.post('/:id/answer', authorize('student'), examController.submitAnswer);
router.post('/:id/submit', authorize('student'), examController.submitExam);
router.get('/:id/timer', authorize('student'), examController.getExamTimer);
router.get('/:id/questions', authorize('student'), examController.getExamQuestions);

export default router;

