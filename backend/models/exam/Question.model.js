import mongoose from 'mongoose';
import { getExamDB } from './index.js';

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  optionA: {
    type: String,
    required: [true, 'Option A is required'],
    trim: true
  },
  optionB: {
    type: String,
    required: [true, 'Option B is required'],
    trim: true
  },
  optionC: {
    type: String,
    required: [true, 'Option C is required'],
    trim: true
  },
  optionD: {
    type: String,
    required: [true, 'Option D is required'],
    trim: true
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: [true, 'Correct answer is required']
  },
  marks: {
    type: Number,
    default: 1,
    min: 1
  },
  explanation: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

questionSchema.index({ examId: 1 });
questionSchema.index({ difficulty: 1 });

// Lazy-load model to avoid connecting before env vars are loaded
let QuestionModel = null;
function getModel() {
  if (!QuestionModel) {
    const examDB = getExamDB();
    QuestionModel = examDB.model('Question', questionSchema);
  }
  return QuestionModel;
}

// Export model methods as functions that lazy-load
export default {
  find: (...args) => getModel().find(...args),
  findById: (...args) => getModel().findById(...args),
  findOne: (...args) => getModel().findOne(...args),
  create: (...args) => getModel().create(...args),
  insertMany: (...args) => getModel().insertMany(...args),
  findByIdAndUpdate: (...args) => getModel().findByIdAndUpdate(...args),
  findByIdAndDelete: (...args) => getModel().findByIdAndDelete(...args),
  countDocuments: (...args) => getModel().countDocuments(...args),
  model: getModel
};
