import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as questionController from '../controllers/question.controller.js';

const router = express.Router();

router.use(protect);

// Question routes
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', adminOnly, questionController.createQuestion);
router.post('/bulk', adminOnly, questionController.createBulkQuestions);
router.put('/:id', adminOnly, questionController.updateQuestion);
router.delete('/:id', adminOnly, questionController.deleteQuestion);

export default router;

