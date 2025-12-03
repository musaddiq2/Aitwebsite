import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as attendanceController from '../controllers/attendance.controller.js';

const router = express.Router();

router.use(protect);

// Attendance routes
router.get('/', attendanceController.getAttendance);
router.get('/stats', attendanceController.getAttendanceStats);
router.post('/', adminOnly, attendanceController.markAttendance);
router.put('/:id', adminOnly, attendanceController.updateAttendance);
router.delete('/:id', adminOnly, attendanceController.deleteAttendance);

export default router;

