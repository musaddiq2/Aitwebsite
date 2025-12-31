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

// ===============================
// 📋 LEAVE APIs (Student)
// ===============================

// Apply for leave
export const applyLeave = async (leaveData) => {
  const response = await axios.post('/leaves', leaveData);
  return response.data;
};

// Get my leaves
export const getLeaves = async (params = {}) => {
  const response = await axios.get('/leaves', { params });
  return response.data;
};

// Get specific leave by ID
export const getLeaveById = async (id) => {
  const response = await axios.get(`/leaves/${id}`);
  return response.data;
};

// Update leave (only pending leaves)
export const updateLeave = async (id, leaveData) => {
  const response = await axios.put(`/leaves/${id}`, leaveData);
  return response.data;
};

// Delete leave (only pending leaves)
export const deleteLeave = async (id) => {
  const response = await axios.delete(`/leaves/${id}`);
  return response.data;
};

// Certificate - Updated to send form data
export const requestCertificate = async (formData) => {
  const response = await axios.post('/certificates', formData);
  return response.data;
};

export const getCertificates = async (params = {}) => {
  const response = await axios.get('/certificates', { params });
  return response.data;
};

export const getCertificateById = async (id) => {
  const response = await axios.get(`/certificates/${id}`);
  return response.data;
};

