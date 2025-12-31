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

// ===============================
// 💰 FEES / INSTALLMENTS ✅ FIXED
// ===============================

// Get all installments
export const getInstallments = async (params = {}) => {
  const response = await axios.get('/installments', { params });
  return response.data;
};

// Get installment by ID
export const getInstallmentById = async (id) => {
  const response = await axios.get(`/installments/${id}`);
  return response.data;
};

// Create installment (Admin)
export const createInstallment = async (installmentData) => {
  const response = await axios.post('/installments', installmentData);
  return response.data;
};

// Update installment
export const updateInstallment = async (id, installmentData) => {
  const response = await axios.put(`/installments/${id}`, installmentData);
  return response.data;
};

// Delete installment
export const deleteInstallment = async (id) => {
  const response = await axios.delete(`/installments/${id}`);
  return response.data;
};

// ===============================
// EXAM MODULE APIs - ADD THESE
// ===============================

// Exams
export const getExams = async (params = {}) => {
  const response = await axios.get('/exams', { params });
  return response.data;
};

export const getExamById = async (id) => {
  const response = await axios.get(`/exams/${id}`);
  return response.data;
};

export const createExam = async (examData) => {
  const response = await axios.post('/exams', examData);
  return response.data;
};

export const updateExam = async (id, examData) => {
  const response = await axios.put(`/exams/${id}`, examData);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await axios.delete(`/exams/${id}`);
  return response.data;
};

// Questions
export const getQuestions = async (params = {}) => {
  const response = await axios.get('/questions', { params });
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await axios.post('/questions', questionData);
  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  const response = await axios.put(`/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await axios.delete(`/questions/${id}`);
  return response.data;
};

// Results (Admin)
export const getResults = async (params = {}) => {
  const response = await axios.get('/results', { params });
  return response.data;
};

export const getResultById = async (id) => {
  const response = await axios.get(`/results/${id}`);
  return response.data;
};

export const releaseResult = async (id, isReleased) => {
  const response = await axios.patch(`/results/${id}/release`, { isReleased });
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

// ===============================
// 📋 LEAVE MANAGEMENT APIs (Admin)
// ===============================

export const getLeaves = async (params = {}) => {
  const response = await axios.get('/leaves', { params });
  return response.data;
};

export const getLeaveById = async (id) => {
  const response = await axios.get(`/leaves/${id}`);
  return response.data;
};

export const approveLeave = async (id) => {
  const response = await axios.put(`/leaves/${id}/approve`);
  return response.data;
};

export const rejectLeave = async (id, data) => {
  const response = await axios.put(`/leaves/${id}/reject`, data);
  return response.data;
};

// ===============================
// 📜 CERTIFICATE MANAGEMENT APIs (Admin)
// ===============================

export const getCertificates = async (params = {}) => {
  const response = await axios.get('/certificates', { params });
  return response.data;
};

export const getCertificateById = async (id) => {
  const response = await axios.get(`/certificates/${id}`);
  return response.data;
};

export const approveCertificate = async (id, data) => {
  const response = await axios.put(`/certificates/${id}/approve`, data);
  return response.data;
};

export const rejectCertificate = async (id, data) => {
  const response = await axios.put(`/certificates/${id}/reject`, data);
  return response.data;
};

export const issueCertificate = async (id, data) => {
  const response = await axios.put(`/certificates/${id}/issue`, data);
  return response.data;
};