import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as adminController from '../controllers/admin.controller.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);
router.get('/dashboard/stats', analyticsController.getDashboardStats);

// Students
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudentById);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Courses
router.get('/courses', adminController.getCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Attendance
router.get('/attendance', adminController.getAttendance);
router.post('/attendance', adminController.markAttendance);
router.get('/attendance/:studentId', adminController.getStudentAttendance);

// Fees/Installments
router.get('/fees', adminController.getFees);
router.post('/fees', adminController.createInstallment);
router.get('/fees/:studentId', adminController.getStudentFees);

// Analytics
router.get('/analytics/attendance', analyticsController.getAttendanceAnalytics);
router.get('/analytics/fees', analyticsController.getFeesAnalytics);

export default router;

