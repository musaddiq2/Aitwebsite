import User from '../models/User.model.js';
import Attendance from '../models/Attendance.model.js';
import Installment from '../models/Installment.model.js';
import Course from '../models/Course.model.js';
import logger from '../configs/logger.js';

export const getDashboardStats = async () => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalCourses,
      todayAttendance,
      totalFees,
      todayFees
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', status: 'Active', isDeleted: false }),
      Course.countDocuments({ isActive: true }),
      Attendance.countDocuments({
        attendanceDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        },
        attendance: 'Present'
      }),
      Installment.aggregate([
        { $group: { _id: null, total: { $sum: '$paidAmount' } } }
      ]),
      Installment.aggregate([
        {
          $match: {
            paidDate: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } }
      ])
    ]);

    return {
      totalStudents,
      activeStudents,
      totalCourses,
      todayAttendance,
      totalFees: totalFees[0]?.total || 0,
      todayFees: todayFees[0]?.total || 0
    };
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    throw error;
  }
};

export const getAttendanceAnalytics = async (startDate, endDate) => {
  try {
    const attendance = await Attendance.aggregate([
      {
        $match: {
          attendanceDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$attendanceDate' },
            year: { $year: '$attendanceDate' }
          },
          present: {
            $sum: { $cond: [{ $eq: ['$attendance', 'Present'] }, 1, 0] }
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$attendance', 'Absent'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return attendance;
  } catch (error) {
    logger.error('Get attendance analytics error:', error);
    throw error;
  }
};

export const getFeesAnalytics = async (startDate, endDate) => {
  try {
    const fees = await Installment.aggregate([
      {
        $match: {
          paidDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$paidDate' },
            year: { $year: '$paidDate' }
          },
          total: { $sum: '$paidAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return fees;
  } catch (error) {
    logger.error('Get fees analytics error:', error);
    throw error;
  }
};

