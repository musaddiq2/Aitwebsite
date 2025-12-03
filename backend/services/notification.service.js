import Notification from '../models/Notification.model.js';
import logger from '../configs/logger.js';

export const createNotification = async (userId, title, message, type = 'info', link = null, metadata = null) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link,
      metadata
    });
    return notification;
  } catch (error) {
    logger.error('Create notification error:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId, limit = 20, skip = 0) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    return { notifications, unreadCount };
  } catch (error) {
    logger.error('Get notifications error:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  } catch (error) {
    logger.error('Mark as read error:', error);
    throw error;
  }
};

export const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return result;
  } catch (error) {
    logger.error('Mark all as read error:', error);
    throw error;
  }
};

