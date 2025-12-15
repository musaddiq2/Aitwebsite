// backend/middleware/loginHistoryMiddleware.js

import LoginHistory from '../models/LoginHistory.model.js';
import { UAParser } from "ua-parser-js";

// This middleware will record login attempts
export const recordLoginHistory = async (req, user, status = 'success') => {
  try {
    // Parse user agent details
    const ua = uaParser(req.headers['user-agent']);

    await LoginHistory.create({
      user: user?._id || null,
      email: user?.email || req.body.email || "unknown",
      ipAddress: req.ip,
      browser: ua.browser.name || 'Unknown',
      os: ua.os.name || 'Unknown',
      device: ua.device.model || 'Desktop',
      status: status, // success / failed
      loginAt: new Date()
    });

  } catch (error) {
    console.error('Error saving login history:', error.message);
  }
};
