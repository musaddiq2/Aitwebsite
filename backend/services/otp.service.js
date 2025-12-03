import OTP from '../models/OTP.model.js';
import { sendOTP } from './sms.service.js';
import logger from '../configs/logger.js';

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in MongoDB
export const storeOTP = async (key, otp, phone, expiryMinutes = 10) => {
  try {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
    
    // Delete old OTP if exists
    await OTP.deleteOne({ key });
    
    await OTP.create({
      key,
      otp,
      phone,
      expiresAt
    });
    return true;
  } catch (error) {
    logger.error('OTP storage error:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (key, otp) => {
  try {
    const otpDoc = await OTP.findOne({ key, verified: false });
    
    if (!otpDoc) {
      return { valid: false, message: 'OTP expired or not found' };
    }
    
    if (otpDoc.otp !== otp) {
      return { valid: false, message: 'Invalid OTP' };
    }
    
    // Mark as verified and delete
    otpDoc.verified = true;
    await otpDoc.save();
    await OTP.deleteOne({ _id: otpDoc._id });
    
    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    logger.error('OTP verification error:', error);
    return { valid: false, message: 'Error verifying OTP' };
  }
};

// Send and store OTP
export const sendAndStoreOTP = async (phone, key) => {
  try {
    const otp = generateOTP();
    await storeOTP(key, otp, phone);
    await sendOTP(phone, otp);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    logger.error('Send OTP error:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

