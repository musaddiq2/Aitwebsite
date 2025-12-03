import { protect, authorize } from './authMiddleware.js';

// Admin-only middleware
export const adminOnly = [protect, authorize('admin')];

// Admin or Student middleware
export const adminOrStudent = [protect, authorize('admin', 'student')];

