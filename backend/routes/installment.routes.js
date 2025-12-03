import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as installmentController from '../controllers/installment.controller.js';

const router = express.Router();

router.use(protect);

// Installment routes
router.get('/', installmentController.getInstallments);
router.get('/:id', installmentController.getInstallmentById);
router.post('/', adminOnly, installmentController.createInstallment);
router.put('/:id', adminOnly, installmentController.updateInstallment);
router.delete('/:id', adminOnly, installmentController.deleteInstallment);

export default router;

