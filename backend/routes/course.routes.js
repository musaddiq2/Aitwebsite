import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import * as courseController from '../controllers/course.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Course routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', adminOnly, courseController.createCourse);
router.put('/:id', adminOnly, courseController.updateCourse);
router.delete('/:id', adminOnly, courseController.deleteCourse);

export default router;

