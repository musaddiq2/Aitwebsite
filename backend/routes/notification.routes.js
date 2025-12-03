import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as notificationService from '../services/notification.service.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.js';

const router = express.Router();

router.use(protect);

// Notification routes
router.get('/', async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const result = await notificationService.getUserNotifications(
      req.user._id,
      parseInt(limit),
      parseInt(skip)
    );
    sendSuccessResponse(res, 200, 'Notifications retrieved successfully', result);
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to fetch notifications');
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    if (!notification) {
      return sendErrorResponse(res, 404, 'Notification not found');
    }
    sendSuccessResponse(res, 200, 'Notification marked as read', notification);
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to mark notification as read');
  }
});

router.put('/read-all', async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    sendSuccessResponse(res, 200, 'All notifications marked as read');
  } catch (error) {
    sendErrorResponse(res, 500, 'Failed to mark all as read');
  }
});

export default router;

