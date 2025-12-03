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
  parentsContactNumber: {
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
  
  // Address
  address: {
    type: String,
    trim: true
  },
  city: {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
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
  
  // Fees
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
    enum: ['Cash', 'Online', 'Cheque', 'UPI', 'Other'],
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
  courseEndDate: {
    type: Date
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
  
  // Last login
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

// Indexes (email and rollNo already have unique: true which creates indexes)
userSchema.index({ status: 1, isDeleted: 1 });
userSchema.index({ courseId: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
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

// Generate balance fees
userSchema.virtual('balanceFees').get(function() {
  return Math.max(0, (this.fullCourseFees || 0) - (this.feesPaidAmount || 0));
});

export default mongoose.model('User', userSchema);

