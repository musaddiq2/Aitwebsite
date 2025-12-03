// Student model - using User model as base, but can be extended
import mongoose from 'mongoose';

// This is essentially the same as User model but with student-specific fields
// We'll use User model with role='student' for students
// This file can be used for student-specific extensions if needed

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rollNo: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  graduationDate: {
    type: Date
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

studentSchema.index({ userId: 1 });
// rollNo already has unique: true which creates an index

export default mongoose.model('Student', studentSchema);

