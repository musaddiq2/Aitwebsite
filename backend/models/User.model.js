import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  whatsappNumber: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date
  },
  qualification: {
    type: String,
    trim: true
  },
 
  
  // Address Information
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: 'India'
  },
  
  // Documents
  aadhaarCard: {
    type: String,
    trim: true
  },
  passportPhoto: {
    type: String,
    trim: true
  },
  
  // Course Information
courseId: {
  type: String,  // ✅ Store course code (e.g., "DSD-6", "MERN21")
  trim: true
},
courseName: {
  type: String,
  trim: true
},
currentCourse: {
  type: String,
  trim: true
},
progressCode: {
  type: String,
  trim: true
},
batchTime: {
  type: String,
  trim: true
},
teacherName: {
  type: String,
  trim: true
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
courseEndDate: {
  type: Date
},

// ✅ NEW: Subject Management
enrolledSubjects: [{
  type: String,
  trim: true
}],
completedSubjects: [{
  type: String,
  trim: true
}],
  
  // Fees Information
  fullCourseFees: {
    type: Number,
    default: 0
  },
  feesPaidAmount: {
    type: Number,
    default: 0
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  feesPaidMode: {
    type: String,
    enum: ['Cash', 'Online', 'Cheque', 'UPI', 'Card', 'Other'],
    trim: true
  },
  
  // Parent/Guardian Information
  parentName: {
    type: String,
    trim: true
  },
  parentPhone: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Pending'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Dates
  registrationDate: {
    type: Date,
    default: Date.now
  },
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  
  // Last login tracking
  lastLogin: {
    type: Date
  },
  lastLoginIP: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ status: 1, isDeleted: 1 });
userSchema.index({ courseId: 1 });
userSchema.index({ enrollmentDate: 1 });
userSchema.index({ batchTime: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for balance fees
userSchema.virtual('balanceFees').get(function() {
  return Math.max(0, (this.fullCourseFees || 0) - (this.feesPaidAmount || 0));
});

// ✅ NEW: Virtual for remaining subjects count
userSchema.virtual('remainingSubjectsCount').get(function() {
  return (this.enrolledSubjects || []).length;
});

// ✅ NEW: Virtual for total subjects progress
userSchema.virtual('subjectProgress').get(function() {
  const enrolled = (this.enrolledSubjects || []).length;
  const completed = (this.completedSubjects || []).length;
  const total = enrolled + completed;
  
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.emailVerificationToken;
  return userObject;
};

export default mongoose.model('User', userSchema);