// Exam models index - handles exam database connection
import mongoose from 'mongoose';

// Create or get exam database connection
let examDBConnection = null;

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

// Initialize exam DB connection
export const initExamDB = async () => {
  try {
    const examDB = getExamDB();
    await examDB.asPromise();
    return examDB;
  } catch (error) {
    console.error('Exam DB connection error:', error);
    throw error;
  }
};

