import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  attendanceDate: {
    type: Date,
    required: [true, 'Attendance date is required'],
    default: Date.now
  },
  attendanceMonth: {
    type: String,
    required: true,
    trim: true
  },
  mobileNo: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherName: {
    type: String,
    trim: true
  },
  batchTime: {
    type: String,
    trim: true
  },
  attendance: {
    type: String,
    enum: ['Present', 'Absent'],
    required: [true, 'Attendance status is required']
  },
  totalPresent: {
    type: Number,
    default: 0
  },
  totalAbsent: {
    type: Number,
    default: 0
  },
  remark: {
    type: String,
    trim: true
  },
  feesDate: {
    type: Date
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate attendance for same student on same date
attendanceSchema.index({ studentId: 1, attendanceDate: 1 }, { unique: true });
attendanceSchema.index({ attendanceDate: 1 });
attendanceSchema.index({ attendanceMonth: 1 });
attendanceSchema.index({ batchTime: 1 });

export default mongoose.model('Attendance', attendanceSchema);

