// This model uses the exam database connection
import mongoose from 'mongoose';
import { getExamDB } from './index.js';

const examSchema = new mongoose.Schema({
  examTitle: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1 // minutes
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: 1
  },
  passingMarks: {
    type: Number,
    default: function() {
      return Math.ceil(this.totalMarks * 0.4); // 40% default
    }
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  instructions: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

examSchema.index({ isActive: 1 });
examSchema.index({ startDate: 1, endDate: 1 });

// Lazy-load model to avoid connecting before env vars are loaded
let ExamModel = null;
function getModel() {
  if (!ExamModel) {
    const examDB = getExamDB();
    ExamModel = examDB.model('Exam', examSchema);
  }
  return ExamModel;
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
