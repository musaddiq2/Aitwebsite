import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import Attendance from '../models/Attendance.model.js';
import Installment from '../models/Installment.model.js';
import { getDashboardStats, getAttendanceAnalytics, getFeesAnalytics } from '../services/analytics.service.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';


// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    sendSuccessResponse(res, 200, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    logger.error('Get dashboard error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch dashboard data');
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status, search, courseId } = req.query;

    const query = { role: 'student', isDeleted: false };
    
    if (status) query.status = status;
    if (courseId) query.courseId = courseId;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }

    const [students, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate('courseId', 'courseName duration fees')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, students, pagination);
  } catch (error) {
    logger.error('Get students error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch students');
  }
};

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private/Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('courseId');

    if (!student || student.role !== 'student') {
      return sendErrorResponse(res, 404, 'Student not found');
    }

    sendSuccessResponse(res, 200, 'Student retrieved successfully', student);
  } catch (error) {
    logger.error('Get student by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch student');
  }
};

// @desc    Create new student
// @route   POST /api/admin/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      role: 'student',
      status: req.body.status || 'Pending'
    };

    // Validate rollNo
    if (!studentData.rollNo || studentData.rollNo.trim() === '') {
      return sendErrorResponse(res, 400, 'Roll Number is required');
    }

    studentData.rollNo = studentData.rollNo.trim();

    // BACKEND VALIDATION: Verify course end date calculation
    if (studentData.courseId && studentData.registrationDate) {
      const course = await Course.findById(studentData.courseId);
      
      if (course) {
        // Extract months from duration
        const match = course.duration.match(/^(\d+)\s*months?$/i);
        
        if (match) {
          const months = parseInt(match[1], 10);
          const regDate = new Date(studentData.registrationDate);
          const calculatedEndDate = new Date(regDate);
          calculatedEndDate.setMonth(regDate.getMonth() + months);
          
          // Auto-set if missing or validate if provided
          if (!studentData.courseEndDate) {
            studentData.courseEndDate = calculatedEndDate;
          } else {
            const providedEndDate = new Date(studentData.courseEndDate);
            const daysDifference = Math.abs(
              (providedEndDate - calculatedEndDate) / (1000 * 60 * 60 * 24)
            );
            
            // Allow small difference (1-2 days) for edge cases
            if (daysDifference > 2) {
              console.warn('End date mismatch detected:', {
                provided: studentData.courseEndDate,
                calculated: calculatedEndDate.toISOString().split('T')[0]
              });
            }
          }
        }
      }
    }

    console.log("Creating student with data:", studentData);

    const student = await User.create(studentData);

    const studentResponse = await User.findById(student._id)
      .select('-password')
      .populate('courseId', 'courseName duration fees');

    sendSuccessResponse(res, 201, 'Student created successfully', studentResponse);
  } catch (error) {
    logger.error('Create student error:', error);

    if (error.code === 11000) {
      const field = error.keyValue?.email ? 'Email' : 'Roll Number';
      sendErrorResponse(res, 400, `${field} already exists`);
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      sendErrorResponse(res, 400, messages.join(', '));
    } else {
      sendErrorResponse(res, 500, 'Failed to create student');
    }
  }
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return sendErrorResponse(res, 404, 'Student not found');
    }

    sendSuccessResponse(res, 200, 'Student updated successfully', student);
  } catch (error) {
    logger.error('Update student error:', error);
    sendErrorResponse(res, 500, 'Failed to update student');
  }
};

// @desc    Delete student (soft delete)
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, status: 'Inactive' },
      { new: true }
    );

    if (!student) {
      return sendErrorResponse(res, 404, 'Student not found');
    }

    sendSuccessResponse(res, 200, 'Student deleted successfully');
  } catch (error) {
    logger.error('Delete student error:', error);
    sendErrorResponse(res, 500, 'Failed to delete student');
  }
};

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private/Admin
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    sendSuccessResponse(res, 200, 'Courses retrieved successfully', courses);
  } catch (error) {
    logger.error('Get courses error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch courses');
  }
};

// @desc    Create course
// @route   POST /api/admin/courses
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
    sendErrorResponse(res, 500, 'Failed to create course');
  }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
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

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
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

// @desc    Get attendance records
// @route   GET /api/admin/attendance
// @access  Private/Admin
export const getAttendance = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { startDate, endDate, batchTime, courseId } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.attendanceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (batchTime) query.batchTime = batchTime;
    if (courseId) query.courseId = courseId;

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .populate('studentId', 'firstName lastName email rollNo')
        .populate('courseId', 'courseName')
        .sort({ attendanceDate: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, attendance, pagination);
  } catch (error) {
    logger.error('Get attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch attendance');
  }
};

// @desc    Mark attendance
// @route   POST /api/admin/attendance
// @access  Private/Admin
export const markAttendance = async (req, res) => {
  try {
    const { studentIds, attendanceDate, batchTime, teacherName, courseId } = req.body;

    const attendanceRecords = studentIds.map(studentId => ({
      studentId,
      attendanceDate: new Date(attendanceDate),
      attendanceMonth: new Date(attendanceDate).toLocaleString('default', { month: 'short', year: 'numeric' }),
      batchTime,
      teacherName,
      courseId,
      attendance: req.body.attendance || 'Present',
      markedBy: req.user._id
    }));

    const created = await Attendance.insertMany(attendanceRecords);
    sendSuccessResponse(res, 201, 'Attendance marked successfully', created);
  } catch (error) {
    logger.error('Mark attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to mark attendance');
  }
};

// @desc    Get student attendance
// @route   GET /api/admin/attendance/:studentId
// @access  Private/Admin
export const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId })
      .populate('courseId', 'courseName')
      .sort({ attendanceDate: -1 });

    sendSuccessResponse(res, 200, 'Student attendance retrieved successfully', attendance);
  } catch (error) {
    logger.error('Get student attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch student attendance');
  }
};

// @desc    Get all fees/installments
// @route   GET /api/admin/fees
// @access  Private/Admin
export const getFees = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { studentId, startDate, endDate } = req.query;

    const query = {};
    if (studentId) query.studentId = studentId;
    if (startDate && endDate) {
      query.paidDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [installments, total] = await Promise.all([
      Installment.find(query)
        .populate('studentId', 'firstName lastName email')
        .populate('courseId', 'courseName')
        .sort({ paidDate: -1 })
        .skip(skip)
        .limit(limit),
      Installment.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, installments, pagination);
  } catch (error) {
    logger.error('Get fees error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch fees');
  }
};

// @desc    Create installment
// @route   POST /api/admin/fees
// @access  Private/Admin
export const createInstallment = async (req, res) => {
  try {
    const { studentId, paidAmount, paidDate, paymentMode } = req.body;

    // Get student to calculate balance
    const student = await User.findById(studentId);
    if (!student) {
      return sendErrorResponse(res, 404, 'Student not found');
    }

    // Get last receipt number
    const lastInstallment = await Installment.findOne().sort({ receiptNo: -1 });
    const receiptNo = lastInstallment ? (parseInt(lastInstallment.receiptNo) + 1).toString() : '1';

    // Calculate new balance
    const newPaidAmount = (student.feesPaidAmount || 0) + paidAmount;
    const balanceFees = Math.max(0, (student.fullCourseFees || 0) - newPaidAmount);

    // Create installment
    const installment = await Installment.create({
      studentId,
      receiptNo,
      name: `${student.firstName} ${student.lastName}`,
      mobileNo: student.phone,
      paidAmount,
      paidDate: new Date(paidDate),
      course: student.courseName,
      courseId: student.courseId,
      totalFees: student.fullCourseFees,
      balanceFees,
      paymentMode,
      createdBy: req.user._id
    });

    // Update student fees
    await User.findByIdAndUpdate(studentId, {
      feesPaidAmount: newPaidAmount
    });

    sendSuccessResponse(res, 201, 'Installment recorded successfully', installment);
  } catch (error) {
    logger.error('Create installment error:', error);
    sendErrorResponse(res, 500, 'Failed to create installment');
  }
};

// @desc    Get student fees
// @route   GET /api/admin/fees/:studentId
// @access  Private/Admin
export const getStudentFees = async (req, res) => {
  try {
    const installments = await Installment.find({ studentId: req.params.studentId })
      .sort({ paidDate: -1 });

    const student = await User.findById(req.params.studentId);
    const feesSummary = {
      totalFees: student?.fullCourseFees || 0,
      paidAmount: student?.feesPaidAmount || 0,
      balanceFees: (student?.fullCourseFees || 0) - (student?.feesPaidAmount || 0),
      installments
    };

    sendSuccessResponse(res, 200, 'Student fees retrieved successfully', feesSummary);
  } catch (error) {
    logger.error('Get student fees error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch student fees');
  }
};
