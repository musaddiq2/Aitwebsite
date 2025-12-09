import Course from '../models/Course.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (authenticated users)

export const getCourses = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    const query = { isActive: true };
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: 'i' } },
        { courseId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    sendSuccessResponse(res, 200, 'Courses retrieved successfully', courses);
  } catch (error) {
    logger.error('Get courses error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch courses');
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public (authenticated users)
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!course) {
      return sendErrorResponse(res, 404, 'Course not found');
    }

    sendSuccessResponse(res, 200, 'Course retrieved successfully', course);
  } catch (error) {
    logger.error('Get course by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch course');
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      createdBy: req.user._id
    });

    sendSuccessResponse(res, 201, 'Course created successfully', course);
  } catch (error) {
    logger.error('Create course error:', error);
    if (error.code === 11000) {
      sendErrorResponse(res, 400, 'Course ID already exists');
    } else {
      sendErrorResponse(res, 500, 'Failed to create course');
    }
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return sendErrorResponse(res, 404, 'Course not found');
    }

    sendSuccessResponse(res, 200, 'Course updated successfully', course);
  } catch (error) {
    logger.error('Update course error:', error);
    sendErrorResponse(res, 500, 'Failed to update course');
  }
};

// @desc    Delete course (soft delete)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return sendErrorResponse(res, 404, 'Course not found');
    }

    sendSuccessResponse(res, 200, 'Course deleted successfully');
  } catch (error) {
    logger.error('Delete course error:', error);
    sendErrorResponse(res, 500, 'Failed to delete course');
  }
};
