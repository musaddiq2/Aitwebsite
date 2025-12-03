import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Analytics routes
router.get('/dashboard/stats', analyticsController.getDashboardStats);
router.get('/attendance', analyticsController.getAttendanceAnalytics);
router.get('/fees', analyticsController.getFeesAnalytics);

export default router;

