import mongoose from 'mongoose';
import logger from './logger.js';

// Get exam database connection
let examDBConnection = null;

// Main database connection
export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Main MongoDB Connected');

    // Exam database (separate connection)
    const examURI = process.env.MONGODB_EXAM_URI || process.env.MONGODB_URI;
    examDBConnection = mongoose.createConnection(examURI);
    await examDBConnection.asPromise();
    logger.info('✅ Exam MongoDB Connected');
    
    return { mainDB: mongoose.connection, examDB: examDBConnection };
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getExamDB = () => {
  if (!examDBConnection) {
    const uri = process.env.MONGODB_EXAM_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI or MONGODB_EXAM_URI must be defined in environment variables');
    }
    examDBConnection = mongoose.createConnection(uri);
  }
  return examDBConnection;
};

export default connectDB;

