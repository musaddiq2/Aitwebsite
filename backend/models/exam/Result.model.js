import mongoose from 'mongoose';
import { getExamDB } from './index.js';

const resultSchema = new mongoose.Schema({
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
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Passed', 'Failed'],
    required: true
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D', ''],
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    marksObtained: {
      type: Number,
      default: 0
    }
  }],
  isReleased: {
    type: Boolean,
    default: false
  },
  releasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  releasedAt: {
    type: Date
  }
}, {
  timestamps: true
});

resultSchema.index({ userId: 1 });
resultSchema.index({ examId: 1 });
resultSchema.index({ examDate: -1 });
resultSchema.index({ status: 1 });

// Lazy-load model to avoid connecting before env vars are loaded
let ResultModel = null;
function getModel() {
  if (!ResultModel) {
    const examDB = getExamDB();
    ResultModel = examDB.model('Result', resultSchema);
  }
  return ResultModel;
}

// Export model methods as functions that lazy-load
export default {
  find: (...args) => getModel().find(...args),
  findById: (...args) => getModel().findById(...args),
  findOne: (...args) => getModel().findOne(...args),
  create: (...args) => getModel().create(...args),
  findByIdAndUpdate: (...args) => getModel().findByIdAndUpdate(...args),
  findByIdAndDelete: (...args) => getModel().findByIdAndDelete(...args),
  countDocuments: (...args) => getModel().countDocuments(...args),
  aggregate: (...args) => getModel().aggregate(...args),
  model: getModel
};
