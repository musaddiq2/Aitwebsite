import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Filter, Download, Plus, Search, TrendingUp, Clock, Eye } from 'lucide-react';

// Import your actual API service
import { getStudents, getCourses } from '../../../services/admin.service';
import axios from '../../../utils/axios';

// API wrapper - using axios directly for better control
const api = {
  getStudents: async (params) => {
    try {
      const response = await getStudents(params);
      return response;
    } catch (error) {
      console.error('API getStudents error:', error);
      throw error;
    }
  },
  getAttendance: async (params) => {
    try {
      const response = await axios.get('/attendance', { params });
      return response.data;
    } catch (error) {
      console.error('API getAttendance error:', error);
      throw error;
    }
  },
  markAttendance: async (data) => {
    try {
      console.log('📤 API Call - POST /attendance with data:', data);
      const response = await axios.post('/attendance', data);
      console.log('📥 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Error:', error);
      console.error('❌ Response Data:', error.response?.data);
      console.error('❌ Status Code:', error.response?.status);
      throw error;
    }
  },
  getAttendanceStats: async (params) => {
    try {
      const response = await axios.get('/attendance/stats', { params });
      return response.data;
    } catch (error) {
      console.error('API getAttendanceStats error:', error);
      throw error;
    }
  },
  getCourses: async () => {
    try {
      const response = await getCourses();
      return response;
    } catch (error) {
      console.error('API getCourses error:', error);
      throw error;
    }
  }
};

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('mark');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    courseId: '',
    batchTime: '',
    date: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'mark') {
      loadStudents();
    } else if (activeTab === 'view') {
      loadAttendanceRecords();
    } else if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab, filters]);

  const loadInitialData = async () => {
    try {
      const coursesData = await api.getCourses();
      if (coursesData.success) {
        setCourses(coursesData.data || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = {
        status: 'Active',
        courseId: filters.courseId || undefined,
        limit: 1000 // Get all active students
      };
      const response = await api.getStudents(params);
      if (response.success) {
        setStudents(response.data || []);
      } else {
        console.error('Failed to load students');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
    setLoading(false);
  };

  const loadAttendanceRecords = async () => {
    setLoading(true);
    try {
      const params = {
        courseId: filters.courseId || undefined,
        batchTime: filters.batchTime || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };
      const response = await api.getAttendance(params);
      if (response.success) {
        setAttendanceRecords(response.data || []);
      } else {
        console.error('Failed to load attendance records');
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      setAttendanceRecords([]);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };
      const response = await api.getAttendanceStats(params);
      if (response.success) {
        setStats(response.data);
      } else {
        console.error('Failed to load stats');
        setStats(null);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(null);
    }
    setLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s._id)));
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleMarkAttendance = async (status) => {
    // Prevent double submission
    if (isSubmitting) {
      console.log('⏳ Already submitting, please wait...');
      return;
    }

    if (selectedStudents.size === 0) {
      setErrorMessage('Please select at least one student');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!filters.date) {
      setErrorMessage('Please select a date');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    try {
      // Get student info
      const selectedStudentsList = students.filter(s => selectedStudents.has(s._id));
      
      if (selectedStudentsList.length === 0) {
        throw new Error('Selected students not found');
      }

      console.log('👥 Selected Students:', selectedStudentsList.map(s => ({
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        rollNo: s.rollNo,
        courseId: s.courseId,
        batchTime: s.batchTime
      })));

      // Build attendance data - matching your attendance.controller.js format
      const attendanceData = {
        studentIds: Array.from(selectedStudents),
        attendanceDate: filters.date,
        attendanceRecords: Array.from(selectedStudents).map(id => ({
          studentId: id,
          attendance: status
        }))
      };

      // Add batchTime if available
      if (filters.batchTime) {
        attendanceData.batchTime = filters.batchTime;
      } else if (selectedStudentsList[0]?.batchTime) {
        attendanceData.batchTime = selectedStudentsList[0].batchTime;
      }

      // Add courseId if available
      if (filters.courseId) {
        attendanceData.courseId = filters.courseId;
      } else if (selectedStudentsList[0]?.courseId) {
        const courseId = typeof selectedStudentsList[0].courseId === 'string' 
          ? selectedStudentsList[0].courseId 
          : selectedStudentsList[0].courseId._id;
        if (courseId) {
          attendanceData.courseId = courseId;
        }
      }

      console.log('📤 Marking Attendance:', {
        endpoint: '/attendance',
        method: 'POST',
        data: attendanceData,
        studentsCount: selectedStudents.size,
        status: status
      });

      // Call API - using /attendance endpoint (not /admin/attendance)
      const response = await api.markAttendance(attendanceData);
      
      console.log('📥 Response:', response);
      
      // Check for success
      if (response.success) {
        console.log('✅ SUCCESS! Attendance marked successfully');
        console.log('✅ Created records:', response.data?.created || 'N/A');
        console.log('✅ Records:', response.data?.records || []);
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Clear selection
        setSelectedStudents(new Set());
        
        // Reload data
        await loadStudents();
        if (activeTab === 'view') {
          await loadAttendanceRecords();
        }
      } else {
        throw new Error(response?.message || 'Server returned unsuccessful response');
      }
      
    } catch (error) {
      console.error('❌ FAILED to mark attendance');
      console.error('❌ Error:', error.message);
      console.error('❌ Response:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      
      // Extract error message
      let message = 'Failed to mark attendance';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      // Show error
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 5000);
      
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.rollNo.toLowerCase().includes(searchLower)
    );
  });

  const StatCard = ({ icon: Icon, label, value, color, percentage }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {percentage !== undefined && (
            <p className="text-sm text-gray-500 mt-2">{percentage}%</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Attendance marked successfully!</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Calendar className="w-10 h-10 text-blue-600" />
          Attendance Management
        </h1>
        <p className="text-gray-600">Track and manage student attendance efficiently</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        {[
          { id: 'mark', label: 'Mark Attendance', icon: Plus },
          { id: 'view', label: 'View Records', icon: Eye },
          { id: 'stats', label: 'Statistics', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mark Attendance Tab */}
      {activeTab === 'mark' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={filters.courseId}
                  onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.courseName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Time</label>
                <select
                  value={filters.batchTime}
                  onChange={(e) => setFilters({ ...filters, batchTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Batches</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Students ({filteredStudents.length})
                </h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleMarkAttendance('Present')}
                  disabled={selectedStudents.size === 0 || loading || isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isSubmitting ? 'Marking...' : `Mark Present (${selectedStudents.size})`}
                </button>
                <button
                  onClick={() => handleMarkAttendance('Absent')}
                  disabled={selectedStudents.size === 0 || loading || isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <XCircle className="w-5 h-5" />
                  {isSubmitting ? 'Marking...' : `Mark Absent (${selectedStudents.size})`}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Roll No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Batch Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600">Loading students...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className="hover:bg-blue-50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{`${student.firstName} ${student.lastName}`}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{student.courseId?.courseName || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3" />
                            {student.batchTime || 'Not assigned'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View Records Tab */}
      {activeTab === 'view' && (
        <div className="space-y-6 animate-fade-in">
          {/* Date Range Filter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={filters.courseId}
                  onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.courseName}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Roll No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Batch</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600">Loading attendance records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record, index) => (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(record.attendanceDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {record.studentId ? `${record.studentId.firstName} ${record.studentId.lastName}` : record.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {record.studentId?.rollNo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.courseId?.courseName || record.course || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3" />
                            {record.batchTime || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            record.attendance === 'Present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.attendance === 'Present' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {record.attendance}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          {/* Date Range Filter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Total Classes"
                value={stats.total}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                icon={CheckCircle}
                label="Present"
                value={stats.present}
                color="bg-gradient-to-br from-green-500 to-green-600"
                percentage={Math.round((stats.present / stats.total) * 100)}
              />
              <StatCard
                icon={XCircle}
                label="Absent"
                value={stats.absent}
                color="bg-gradient-to-br from-red-500 to-red-600"
                percentage={Math.round((stats.absent / stats.total) * 100)}
              />
              <StatCard
                icon={TrendingUp}
                label="Attendance Rate"
                value={`${stats.percentage}%`}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
            </div>
          )}

          {/* Visual Progress */}
          {stats && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Attendance Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">Present</span>
                    <span className="text-sm font-medium text-green-600">{stats.present} ({Math.round((stats.present / stats.total) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(stats.present / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-red-600">Absent</span>
                    <span className="text-sm font-medium text-red-600">{stats.absent} ({Math.round((stats.absent / stats.total) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(stats.absent / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        tbody tr {
          animation: fade-in 0.3s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

export default Attendance;