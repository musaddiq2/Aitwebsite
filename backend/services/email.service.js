import nodemailer from 'nodemailer';
import logger from '../configs/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h2>Welcome to AIT Platform!</h2>
    <p>Dear ${user.firstName} ${user.lastName},</p>
    <p>Your account has been successfully created.</p>
    <p>Email: ${user.email}</p>
    <p>Thank you for joining us!</p>
  `;
  return sendEmail(user.email, 'Welcome to AIT Platform', html);
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;
  return sendEmail(user.email, 'Password Reset Request', html);
};

