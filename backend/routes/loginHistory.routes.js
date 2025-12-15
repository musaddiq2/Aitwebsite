// backend/routes/loginHistory.routes.js
import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  getMyLoginHistory,
  getAllLoginHistory,
  getUserLoginHistory,
  getLoginStats
} from '../controllers/loginHistory.controller.js';

const router = express.Router();

// User routes (authenticated users can view their own history)
router.get('/me', protect, getMyLoginHistory);

// Admin routes
router.get('/stats', protect, authorize('admin'), getLoginStats);
router.get('/user/:userId', protect, authorize('admin'), getUserLoginHistory);
router.get('/', protect, authorize('admin'), getAllLoginHistory);

export default router;