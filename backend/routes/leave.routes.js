import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as leaveController from '../controllers/leave.controller.js';

const router = express.Router();

router.use(protect);

// Leave routes
router.get('/', leaveController.getLeaves);
router.get('/:id', leaveController.getLeaveById);
router.post('/', authorize('student'), leaveController.applyLeave);
router.put('/:id', authorize('student'), leaveController.updateLeave);
router.put('/:id/approve', adminOnly, leaveController.approveLeave);
router.put('/:id/reject', adminOnly, leaveController.rejectLeave);
router.delete('/:id', authorize('student'), leaveController.deleteLeave);

export default router;

