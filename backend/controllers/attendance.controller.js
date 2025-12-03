import Attendance from '../models/Attendance.model.js';
import User from '../models/User.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { studentId, startDate, endDate, batchTime, courseId, attendance } = req.query;

    const query = {};
    
    // If student role, only show their attendance
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (startDate && endDate) {
      query.attendanceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (batchTime) query.batchTime = batchTime;
    if (courseId) query.courseId = courseId;
    if (attendance) query.attendance = attendance;

    const [attendanceRecords, total] = await Promise.all([
      Attendance.find(query)
        .populate('studentId', 'firstName lastName email rollNo')
        .populate('courseId', 'courseName')
        .sort({ attendanceDate: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(total, page, limit);
    sendPaginatedResponse(res, attendanceRecords, pagination);
  } catch (error) {
    logger.error('Get attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch attendance');
  }
};

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Admin
export const markAttendance = async (req, res) => {
  try {
    const { studentIds, attendanceDate, batchTime, teacherName, courseId, attendanceRecords } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return sendErrorResponse(res, 400, 'Student IDs are required');
    }

    if (!attendanceDate) {
      return sendErrorResponse(res, 400, 'Attendance date is required');
    }

    const date = new Date(attendanceDate);
    const attendanceMonth = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    const records = [];
    const errors = [];

    for (const studentId of studentIds) {
      try {
        // Check if attendance already exists for this date
        const existing = await Attendance.findOne({
          studentId,
          attendanceDate: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999))
          }
        });

        if (existing) {
          errors.push({ studentId, message: 'Attendance already marked for this date' });
          continue;
        }

        // Get student info
        const student = await User.findById(studentId);
        if (!student) {
          errors.push({ studentId, message: 'Student not found' });
          continue;
        }

        // Get attendance status for this student
        const attendanceStatus = attendanceRecords?.find(r => r.studentId === studentId)?.attendance || 'Present';

        const record = await Attendance.create({
          studentId,
          name: `${student.firstName} ${student.lastName}`,
          attendanceDate: date,
          attendanceMonth,
          mobileNo: student.phone,
          course: student.courseName,
          courseId: student.courseId,
          teacherName: teacherName || student.teacherName,
          batchTime: batchTime || student.batchTime,
          attendance: attendanceStatus,
          markedBy: req.user._id
        });

        records.push(record);
      } catch (error) {
        errors.push({ studentId, message: error.message });
      }
    }

    sendSuccessResponse(res, 201, 'Attendance marked successfully', {
      created: records.length,
      errors: errors.length > 0 ? errors : undefined,
      records
    });
  } catch (error) {
    logger.error('Mark attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to mark attendance');
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private/Admin
export const updateAttendance = async (req, res) => {
  try {
    const { attendance, remark } = req.body;

    const attendanceRecord = await Attendance.findByIdAndUpdate(
      req.params.id,
      { attendance, remark },
      { new: true, runValidators: true }
    ).populate('studentId', 'firstName lastName');

    if (!attendanceRecord) {
      return sendErrorResponse(res, 404, 'Attendance record not found');
    }

    sendSuccessResponse(res, 200, 'Attendance updated successfully', attendanceRecord);
  } catch (error) {
    logger.error('Update attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to update attendance');
  }
};

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return sendErrorResponse(res, 404, 'Attendance record not found');
    }

    sendSuccessResponse(res, 200, 'Attendance deleted successfully');
  } catch (error) {
    logger.error('Delete attendance error:', error);
    sendErrorResponse(res, 500, 'Failed to delete attendance');
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private
export const getAttendanceStats = async (req, res) => {
  try {
    const { studentId, startDate, endDate } = req.query;
    
    const query = {};
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (startDate && endDate) {
      query.attendanceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$attendance',
          count: { $sum: 1 }
        }
      }
    ]);

    const present = stats.find(s => s._id === 'Present')?.count || 0;
    const absent = stats.find(s => s._id === 'Absent')?.count || 0;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    sendSuccessResponse(res, 200, 'Attendance stats retrieved successfully', {
      present,
      absent,
      total,
      percentage
    });
  } catch (error) {
    logger.error('Get attendance stats error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch attendance stats');
  }
};
