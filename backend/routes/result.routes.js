import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as resultController from '../controllers/result.controller.js';

const router = express.Router();

router.use(protect);

// Result routes
router.get('/', resultController.getResults);
router.get('/:id', resultController.getResultById);
router.put('/:id/release', adminOnly, resultController.releaseResult);
router.get('/exam/:examId/stats', adminOnly, resultController.getExamStats);

export default router;

