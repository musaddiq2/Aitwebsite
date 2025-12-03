import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for automatic deletion
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Clean up expired OTPs periodically
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OTP', otpSchema);

