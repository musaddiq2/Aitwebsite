import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  certificateNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  // Student Information
  studentEmail: {
    type: String,
    required: true,
    trim: true
  },
  studentFullName: {
    type: String,
    required: true,
    trim: true
  },
  contactNo: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  mothersName: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  
  // Course & Fee Information
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  paidAmount: {
    type: Number,
    required: true
  },
  totalFees: {
    type: Number,
    required: true
  },
  
  // Additional Information
  remark: {
    type: String,
    trim: true
  },
  
  // Documents
  studentSign: {
    type: String, // URL or base64
    trim: true
  },
  studentPhoto: {
    type: String, // URL or base64
    trim: true
  },
  
  // Certificate Details
  issueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Issued', 'Rejected'],
    default: 'Pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  certificateUrl: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

certificateSchema.index({ studentId: 1 });
certificateSchema.index({ courseId: 1 });
certificateSchema.index({ status: 1 });

export default mongoose.model('Certificate', certificateSchema);