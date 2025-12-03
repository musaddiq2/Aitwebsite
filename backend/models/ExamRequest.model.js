import mongoose from 'mongoose';

const examRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  examDate: {
    type: Date
  }
}, {
  timestamps: true
});

examRequestSchema.index({ userId: 1 });
examRequestSchema.index({ examId: 1 });
examRequestSchema.index({ status: 1 });

export default mongoose.model('ExamRequest', examRequestSchema);

