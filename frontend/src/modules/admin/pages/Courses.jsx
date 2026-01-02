import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse, createCourse } from '../../../services/admin.service';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  BarChart3,
  Users,
  Eye,
  Filter,
  Download,
  XCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // NEW STATES (add these here)
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    description: '',
    duration: '',
    fees: '',
    category: '',
    level: 'Beginner',
    subjects: [],
    prerequisites: [],
    isActive: true
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [prerequisiteInput, setPrerequisiteInput] = useState('');

  // ADD FORM HANDLERS HERE (after state declarations, before useEffect)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleAddPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
      }));
      setPrerequisiteInput('');
    }
  };

  const handleRemovePrerequisite = (index) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const courseData = {
        ...formData,
        fees: Number(formData.fees)
      };
      
      const response = await createCourse(courseData);
      if (response.success) {
        toast.success('Course created successfully');
        setShowAddModal(false);
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      console.error('Create course error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create course';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      courseName: '',
      description: '',
      duration: '',
      fees: '',
      category: '',
      level: 'Beginner',
      subjects: [],
      prerequisites: [],
      isActive: true
    });
    setSubjectInput('');
    setPrerequisiteInput('');
  };

  // Debounce search (your existing useEffect)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCourses();
  }, [debouncedSearch, filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filter !== 'all') params.isActive = filter === 'active' ? 'true' : 'false';

      const response = await getCourses(params);
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to load courses');
      console.error('Courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await deleteCourse(id);
      if (response.success) {
        toast.success('Course deleted successfully');
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.isActive).length,
    inactive: courses.filter(c => !c.isActive).length,
    beginner: courses.filter(c => c.level === 'Beginner').length,
    intermediate: courses.filter(c => c.level === 'Intermediate').length,
    advanced: courses.filter(c => c.level === 'Advanced').length
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage and monitor all courses
          </p>
        </div>

        {/* Add Course Button */}
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 px-4 md:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
          <span className="font-semibold">Add Course</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Courses</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Active</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Beginner</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">{stats.beginner}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Advanced</p>
              <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.advanced}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by course name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base placeholder-gray-400"
            />
            {search && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Courses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        {loading && debouncedSearch !== search && (
          <p className="text-sm text-gray-500 mt-2">Searching...</p>
        )}
      </motion.div>

      {/* Courses Grid */}
      <AnimatePresence mode="wait">
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No courses found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 group ${
                !course.isActive ? 'border-red-200 bg-gray-50 opacity-80' : 'border-gray-200 shadow-sm'}`} > 
                
           <div className="flex justify-end mb-2">
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    course.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }`}>                                                                                     
                    {course.isActive ? 'Active' : 'Inactive'}
                 </span>
           </div>
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {course.courseId}
                    </p>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full ${course.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {course.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                  {course.description || 'No description available'}
                </p>

                {/* Course Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">{course.duration}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Fees:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      ₹{course.fees?.toLocaleString()}
                    </span>
                  </div>

                  {course.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BarChart3 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Category:</span>
                      <span className="ml-2">{course.category}</span>
                    </div>
                  )}
                </div>

                {/* Subjects */}
                {course.subjects && course.subjects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.subjects.slice(0, 3).map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md"
                        >
                          {subject}
                        </span>
                      ))}
                      {course.subjects.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{course.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/admin/courses/${course._id}`)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/admin/courses/edit/${course._id}`)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(course._id)}
                    className="flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Add Course Modal */}
<AnimatePresence>
  {showAddModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      onClick={() => setShowAddModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course ID & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Introduction to Programming"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Course description..."
            />
          </div>

          {/* Duration, Fees, Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 6 months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fees (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Programming"
              />
            </div>
          </div>

          {/* Level & Active Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active Course</span>
              </label>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add subject and press Enter"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add prerequisite and press Enter"
              />
              <button
                type="button"
                onClick={handleAddPrerequisite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {prereq}
                  <button
                    type="button"
                    onClick={() => handleRemovePrerequisite(index)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Course
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
};

export default Courses;