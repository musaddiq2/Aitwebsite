import Installment from '../models/Installment.model.js';
import User from '../models/User.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get all installments
// @route   GET /api/installments
// @access  Private
export const getInstallments = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { studentId, startDate, endDate } = req.query;

    const query = {};
    
    // If student role, only show their installments
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (studentId) {
      query.studentId = studentId;
    }

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
    logger.error('Get installments error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch installments');
  }
};

// @desc    Get installment by ID
// @route   GET /api/installments/:id
// @access  Private
export const getInstallmentById = async (req, res) => {
  try {
    const installment = await Installment.findById(req.params.id)
      .populate('studentId', 'firstName lastName email')
      .populate('courseId', 'courseName');

    if (!installment) {
      return sendErrorResponse(res, 404, 'Installment not found');
    }

    // Check if user has access
    if (req.user.role === 'student' && installment.studentId._id.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    sendSuccessResponse(res, 200, 'Installment retrieved successfully', installment);
  } catch (error) {
    logger.error('Get installment by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch installment');
  }
};

// @desc    Create installment
// @route   POST /api/installments
// @access  Private/Admin
export const createInstallment = async (req, res) => {
  try {
    const { studentId, paidAmount, paidDate, paymentMode, transactionId, bankName, chequeNumber } = req.body;

    if (!studentId || !paidAmount || !paidDate || !paymentMode) {
      return sendErrorResponse(res, 400, 'Student ID, paid amount, paid date, and payment mode are required');
    }

    // Get student
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
      transactionId,
      bankName,
      chequeNumber,
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

// @desc    Update installment
// @route   PUT /api/installments/:id
// @access  Private/Admin
export const updateInstallment = async (req, res) => {
  try {
    const installment = await Installment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId');

    if (!installment) {
      return sendErrorResponse(res, 404, 'Installment not found');
    }

    sendSuccessResponse(res, 200, 'Installment updated successfully', installment);
  } catch (error) {
    logger.error('Update installment error:', error);
    sendErrorResponse(res, 500, 'Failed to update installment');
  }
};

// @desc    Delete installment
// @route   DELETE /api/installments/:id
// @access  Private/Admin
export const deleteInstallment = async (req, res) => {
  try {
    const installment = await Installment.findById(req.params.id);
    
    if (!installment) {
      return sendErrorResponse(res, 404, 'Installment not found');
    }

    // Update student fees (subtract the deleted installment)
    const student = await User.findById(installment.studentId);
    if (student) {
      const newPaidAmount = Math.max(0, (student.feesPaidAmount || 0) - installment.paidAmount);
      await User.findByIdAndUpdate(installment.studentId, {
        feesPaidAmount: newPaidAmount
      });
    }

    await Installment.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, 200, 'Installment deleted successfully');
  } catch (error) {
    logger.error('Delete installment error:', error);
    sendErrorResponse(res, 500, 'Failed to delete installment');
  }
};
