import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as certificateController from '../controllers/certificate.controller.js';

const router = express.Router();

router.use(protect);

// Certificate routes
router.get('/', certificateController.getCertificates);
router.get('/:id', certificateController.getCertificateById);
router.post('/', authorize('student'), certificateController.requestCertificate);
router.put('/:id/approve', adminOnly, certificateController.approveCertificate);
router.put('/:id/reject', adminOnly, certificateController.rejectCertificate);
router.put('/:id/issue', adminOnly, certificateController.issueCertificate);

export default router;

