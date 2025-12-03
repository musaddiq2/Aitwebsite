import twilio from 'twilio';
import logger from '../configs/logger.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    logger.info(`SMS sent: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    logger.error('SMS send error:', error);
    throw error;
  }
};

export const sendOTP = async (phone, otp) => {
  const message = `Your AIT Platform OTP is: ${otp}. Valid for 10 minutes.`;
  return sendSMS(phone, message);
};

