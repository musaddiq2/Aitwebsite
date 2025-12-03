import axios from '../utils/axios';

// Dashboard
export const getDashboard = async () => {
  const response = await axios.get('/student/dashboard');
  return response.data;
};

// Profile
export const getProfile = async () => {
  const response = await axios.get('/student/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axios.put('/student/profile', profileData);
  return response.data;
};

// Attendance
export const getAttendance = async (params = {}) => {
  const response = await axios.get('/student/attendance', { params });
  return response.data;
};

// Fees
export const getFees = async () => {
  const response = await axios.get('/student/fees');
  return response.data;
};

export const getFeesHistory = async () => {
  const response = await axios.get('/student/fees/history');
  return response.data;
};

// Exams
export const getExams = async () => {
  const response = await axios.get('/student/exams');
  return response.data;
};

export const getExamDetails = async (examId) => {
  const response = await axios.get(`/student/exams/${examId}`);
  return response.data;
};

// Results
export const getResults = async () => {
  const response = await axios.get('/student/results');
  return response.data;
};

export const getResultById = async (resultId) => {
  const response = await axios.get(`/student/results/${resultId}`);
  return response.data;
};

// Leave
export const applyLeave = async (leaveData) => {
  const response = await axios.post('/student/leave', leaveData);
  return response.data;
};

export const getLeaves = async () => {
  const response = await axios.get('/student/leave');
  return response.data;
};

// Certificate
export const requestCertificate = async () => {
  const response = await axios.post('/student/certificate');
  return response.data;
};

export const getCertificates = async () => {
  const response = await axios.get('/student/certificate');
  return response.data;
};

