import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['admin', 'student'],
    required: true
  },
  loginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  currentLocation: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    default: 'Success'
  },
  failureReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

loginHistorySchema.index({ userId: 1 });
loginHistorySchema.index({ loginTime: -1 });
loginHistorySchema.index({ userType: 1 });

export default mongoose.model('LoginHistory', loginHistorySchema);

