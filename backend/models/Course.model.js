import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  fees: {
    type: Number,
    required: [true, 'Fees is required'],
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subjects: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// ============================================
// PRE-SAVE HOOK: Normalize duration format
// ============================================
// This automatically converts any duration format to "X months"
// Examples:
//   "6" → "6 months"
//   "DSD-6" → "6 months"  
//   "12 Months" → "12 months"
//   "MERN Stack 6" → "6 months"
courseSchema.pre('save', function(next) {
  if (this.duration) {
    // Normalize duration format
    const duration = this.duration.trim().toLowerCase();
    
    // Extract number from various formats
    const match = duration.match(/(\d+)/);
    
    if (match) {
      const months = match[1];
      // Standardize to "X months" format
      this.duration = `${months} months`;
      console.log('✅ Normalized duration to:', this.duration);
    } else {
      console.warn('⚠️ Could not extract months from duration:', this.duration);
    }
  }
  next();
});

// ============================================
// INDEXES
// ============================================
courseSchema.index({ courseName: 1 });
courseSchema.index({ isActive: 1 });

export default mongoose.model('Course', courseSchema);