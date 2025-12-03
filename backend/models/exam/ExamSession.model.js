import mongoose from 'mongoose';

const examSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true
  },
  startTime: {
    type: Number, // Unix timestamp in milliseconds
    required: true
  },
  endTime: {
    type: Number, // Unix timestamp in milliseconds
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  questions: {
    type: mongoose.Schema.Types.Mixed, // Store questions array
    default: null
  },
  answers: {
    type: mongoose.Schema.Types.Mixed, // Store answers object
    default: {}
  },
  connected: {
    type: Boolean,
    default: false
  },
  submitted: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for automatic deletion
  }
}, {
  timestamps: true
});

// Compound index for quick lookup
examSessionSchema.index({ userId: 1, examId: 1 }, { unique: true });
examSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('ExamSession', examSessionSchema);

