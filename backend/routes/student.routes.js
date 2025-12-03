import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import * as studentController from '../controllers/student.controller.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// Dashboard
router.get('/dashboard', studentController.getDashboard);

// Profile
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// Attendance
router.get('/attendance', studentController.getAttendance);

// Fees
router.get('/fees', studentController.getFees);
router.get('/fees/history', studentController.getFeesHistory);

// Exams
router.get('/exams', studentController.getExams);
router.get('/exams/:examId', studentController.getExamDetails);

// Results
router.get('/results', studentController.getResults);
router.get('/results/:resultId', studentController.getResultById);

// Leave
router.post('/leave', studentController.applyLeave);
router.get('/leave', studentController.getLeaves);

// Certificate
router.post('/certificate', studentController.requestCertificate);
router.get('/certificate', studentController.getCertificates);

export default router;
