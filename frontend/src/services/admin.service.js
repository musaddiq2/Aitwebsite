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

// Courses
export const getCourses = async () => {
  const response = await axios.get('/admin/courses');
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axios.post('/admin/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axios.put(`/admin/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axios.delete(`/admin/courses/${id}`);
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

