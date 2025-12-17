import axios from '../utils/axios';

// Dashboard
export const getDashboardStats = async () => {
  const response = await axios.get('/admin/dashboard/stats');
  return response.data;
};

// Students
export const getStudents = async (params = {}) => {
  const response = await axios.get('/admin/students', { params });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axios.get(`/admin/students/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post('/admin/students', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`/admin/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`/admin/students/${id}`);
  return response.data;
};

// ===============================
// Courses  ✅ FIXED
// ===============================
export const getCourses = async (params = {}) => {
  const response = await axios.get('/courses', { params });
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axios.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axios.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axios.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axios.delete(`/courses/${id}`);
  return response.data;
};

// Attendance
export const getAttendance = async (params = {}) => {
  const response = await axios.get('/admin/attendance', { params });
  return response.data;
};

export const markAttendance = async (attendanceData) => {
  const response = await axios.post('/admin/attendance', attendanceData);
  return response.data;
};

export const getStudentAttendance = async (studentId) => {
  const response = await axios.get(`/admin/attendance/${studentId}`);
  return response.data;
};

// Fees
export const getFees = async (params = {}) => {
  const response = await axios.get('/admin/fees', { params });
  return response.data;
};

export const createInstallment = async (installmentData) => {
  const response = await axios.post('/admin/fees', installmentData);
  return response.data;
};

export const getStudentFees = async (studentId) => {
  const response = await axios.get(`/admin/fees/${studentId}`);
  return response.data;
};

// Analytics
export const getAttendanceAnalytics = async (startDate, endDate) => {
  const response = await axios.get('/admin/analytics/attendance', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getFeesAnalytics = async (startDate, endDate) => {
  const response = await axios.get('/admin/analytics/fees', {
    params: { startDate, endDate }
  });
  return response.data;
};

// ===============================
// Login History APIs (Admin)
// ===============================

// Get all login history (admin)
export const getLoginHistory = async (params = {}) => {
  const response = await axios.get("/login-history", { params });
  return response.data;
};

// Get stats (admin)
export const getLoginStats = async () => {
  const response = await axios.get("/login-history/stats");
  return response.data;
};

// Get specific user login history
export const getUserLoginHistory = async (userId) => {
  const response = await axios.get(`/login-history/user/${userId}`);
  return response.data;
};

// Get logged-in user history
export const getMyLoginHistory = async () => {
  const response = await axios.get("/login-history/me");
  return response.data;
};
