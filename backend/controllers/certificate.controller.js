import Certificate from '../models/Certificate.model.js';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../utils/response.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import logger from '../configs/logger.js';

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private
export const getCertificates = async (req, res) => {
  try {
    if (!req.user) {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }

    // Pagination
    const { page, limit, skip } = getPaginationParams(req);
    const skipNum = Number(skip) || 0;
    const limitNum = Number(limit) || 10;

    // Query filters
    const { studentId, status, courseId } = req.query;
    const query = {};

    // Student can only see their own certificates
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } 
    // Admin can filter by studentId
    else if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      query.studentId = studentId;
    }

    // Status filter
    if (status) query.status = status;

    // Course filter
    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      query.courseId = courseId;
    }

    // Fetch certificates and total count in parallel
    const [certificates, total] = await Promise.all([
      Certificate.find(query)
        .populate('studentId', 'firstName lastName email rollNo')
        .populate('courseId', 'courseName duration')
        .populate('approvedBy', 'firstName lastName')
        .sort({ requestDate: -1 })
        .skip(skipNum)
        .limit(limitNum),
      Certificate.countDocuments(query)
    ]);

    // Pagination metadata
    const pagination = getPaginationMeta(total, page, limitNum);

    // Send response
    sendPaginatedResponse(res, certificates, pagination);

  } catch (error) {
    logger.error('Get certificates error:', error);
    sendErrorResponse(res, 500, error.message || 'Failed to fetch certificates');
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('studentId')
      .populate('courseId')
      .populate('approvedBy');

    if (!certificate) {
      return sendErrorResponse(res, 404, 'Certificate not found');
    }

    // Check if user has access
    if (req.user.role === 'student' && certificate.studentId._id.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    sendSuccessResponse(res, 200, 'Certificate retrieved successfully', certificate);
  } catch (error) {
    logger.error('Get certificate by ID error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch certificate');
  }
};

// @desc    Request certificate
// @route   POST /api/certificates
// @access  Private/Student
export const requestCertificate = async (req, res) => {
  try {
    const {
      studentEmail,
      studentFullName,
      contactNo,
      dateOfBirth,
      mothersName,
      qualification,
      courseName,
      paidAmount,
      totalFees,
      remark,
      studentSign,
      studentPhoto
    } = req.body;

    const student = await User.findById(req.user._id);
    
    if (!student.courseId) {
      return sendErrorResponse(res, 400, 'No course enrolled');
    }

    // Check if certificate already requested for this course
    const existing = await Certificate.findOne({
      studentId: req.user._id,
      courseId: student.courseId,
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existing) {
      return sendErrorResponse(res, 400, 'Certificate already requested for this course');
    }

    // Generate certificate number
    const lastCertificate = await Certificate.findOne().sort({ certificateNumber: -1 });
    const certNumber = lastCertificate 
      ? `CERT-${parseInt(lastCertificate.certificateNumber.split('-')[1]) + 1}`
      : 'CERT-1001';

    const certificate = await Certificate.create({
      studentId: req.user._id,
      courseId: student.courseId,
      certificateNumber: certNumber,
      studentEmail,
      studentFullName,
      contactNo,
      dateOfBirth,
      mothersName,
      qualification,
      courseName,
      paidAmount,
      totalFees,
      remark,
      studentSign,
      studentPhoto,
      status: 'Pending'
    });

    sendSuccessResponse(res, 201, 'Certificate request submitted successfully', certificate);
  } catch (error) {
    logger.error('Request certificate error:', error);
    sendErrorResponse(res, 500, 'Failed to submit certificate request');
  }
};

// @desc    Approve certificate
// @route   PUT /api/certificates/:id/approve
// @access  Private/Admin
export const approveCertificate = async (req, res) => {
  try {
    const { certificateUrl } = req.body;

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy: req.user._id,
        approvedDate: new Date(),
        issueDate: new Date(),
        certificateUrl: certificateUrl || null
      },
      { new: true }
    ).populate('studentId').populate('courseId');

    if (!certificate) {
      return sendErrorResponse(res, 404, 'Certificate not found');
    }

    sendSuccessResponse(res, 200, 'Certificate approved successfully', certificate);
  } catch (error) {
    logger.error('Approve certificate error:', error);
    sendErrorResponse(res, 500, 'Failed to approve certificate');
  }
};

// @desc    Reject certificate
// @route   PUT /api/certificates/:id/reject
// @access  Private/Admin
export const rejectCertificate = async (req, res) => {
  try {
    const { remarks } = req.body;

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        approvedBy: req.user._id,
        approvedDate: new Date(),
        remarks: remarks || 'Certificate request rejected'
      },
      { new: true }
    );

    if (!certificate) {
      return sendErrorResponse(res, 404, 'Certificate not found');
    }

    sendSuccessResponse(res, 200, 'Certificate rejected successfully', certificate);
  } catch (error) {
    logger.error('Reject certificate error:', error);
    sendErrorResponse(res, 500, 'Failed to reject certificate');
  }
};

// @desc    Issue certificate
// @route   PUT /api/certificates/:id/issue
// @access  Private/Admin
export const issueCertificate = async (req, res) => {
  try {
    const { certificateUrl } = req.body;

    if (!certificateUrl) {
      return sendErrorResponse(res, 400, 'Certificate URL is required');
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Issued',
        certificateUrl,
        issueDate: new Date()
      },
      { new: true }
    );

    if (!certificate) {
      return sendErrorResponse(res, 404, 'Certificate not found');
    }

    sendSuccessResponse(res, 200, 'Certificate issued successfully', certificate);
  } catch (error) {
    logger.error('Issue certificate error:', error);
    sendErrorResponse(res, 500, 'Failed to issue certificate');
  }
};
