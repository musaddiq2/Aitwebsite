import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  CreditCard,
  Save,
  X,
  ArrowLeft,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Clock,
  FileText
} from 'lucide-react';
import { getCourses } from '../../../services/admin.service';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [nextRollNo, setNextRollNo] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: '',
    qualification: '',
    
    
    // Parent/Guardian Information
    parentName: '',
    parentPhone: '',
    emergencyContact: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Documents
    aadhaarCard: '',
    passportPhoto: '',
    
    // Registration
    registrationDate: new Date().toISOString().split('T')[0],
    
    // Course Information
    qualification: '',
    courseId: '',
    courseName: '',
    rollNo: '',
    fullCourseFees: '',
    feesPaidAmount: '0',
    receiptNumber: '',
    feesPaidMode: '',
    
    // Account & Security
    progressCode: '',
    batchTime: '',
    courseEndDate: '',
    teacherName: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    
    // Status
    status: 'Active'
  });

  useEffect(() => {
  fetchCourses();
  
}, []);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await getCourses({ isActive: 'true' });
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  };
  const calculateCourseEndDate = (registrationDate, durationString) => {
  // Validate inputs
  if (!registrationDate || !durationString) {
    console.warn('❌ Missing parameters:', { registrationDate, durationString });
    return '';
  }

  try {
    // Clean and normalize the duration string
    const cleanDuration = durationString.trim().toLowerCase();
    
    console.log('🔍 Processing duration:', durationString);
    
    let monthsToAdd = 0;

    // Pattern 1: "6 months", "12 Months", "3months", "6 month"
    const standardMatch = cleanDuration.match(/(\d+)\s*months?/i);
    
    // Pattern 2: "DSD-6", "DSD-12", "Course-6" etc.
    const dsdMatch = cleanDuration.match(/dsd[-_]?(\d+)/i);
    
    // Pattern 3: Just a number "6", "12"
    const numberMatch = cleanDuration.match(/^(\d+)$/);
    
    // Pattern 4: "6m", "12m"
    const shortMatch = cleanDuration.match(/(\d+)\s*m$/i);

    if (standardMatch) {
      monthsToAdd = parseInt(standardMatch[1], 10);
      console.log('✅ Standard format detected:', monthsToAdd, 'months');
    } else if (dsdMatch) {
      monthsToAdd = parseInt(dsdMatch[1], 10);
      console.log('✅ DSD format detected:', monthsToAdd, 'months');
    } else if (numberMatch) {
      monthsToAdd = parseInt(numberMatch[1], 10);
      console.log('✅ Number format detected:', monthsToAdd, 'months');
    } else if (shortMatch) {
      monthsToAdd = parseInt(shortMatch[1], 10);
      console.log('✅ Short format detected:', monthsToAdd, 'months');
    } else {
      console.error('❌ Invalid duration format:', durationString);
      console.log('💡 Expected formats: "6 months", "DSD-6", "12", "6m"');
      return '';
    }

    // Validate extracted months
    if (isNaN(monthsToAdd) || monthsToAdd <= 0 || monthsToAdd > 120) {
      console.warn('❌ Invalid months value:', monthsToAdd);
      return '';
    }

    // Parse registration date
    const regDate = new Date(registrationDate);
    
    // Validate the registration date
    if (isNaN(regDate.getTime())) {
      console.warn('❌ Invalid registration date:', registrationDate);
      return '';
    }

    // Create end date by adding months
    const endDate = new Date(regDate);
    endDate.setMonth(regDate.getMonth() + monthsToAdd);

    // Handle edge case: If day doesn't exist in target month
    if (endDate.getDate() !== regDate.getDate()) {
      endDate.setDate(0); // Sets to last day of previous month
    }

    // Format as YYYY-MM-DD for input type="date"
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log('✅ Calculated end date:', formattedDate);
    console.log('📅', registrationDate, '+', monthsToAdd, 'months =', formattedDate);
    
    return formattedDate;
  } catch (error) {
    console.error('❌ Error calculating course end date:', error);
    return '';
  }
};

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only JPG, PNG or PDF files');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size should not exceed 5MB');
        return;
      }

      if (fileType === 'aadhaar') {
        setAadhaarFile(file);
        setFormData(prev => ({
          ...prev,
          aadhaarCard: file.name
        }));
        toast.success('Aadhaar card file selected');
      } else if (fileType === 'photo') {
        setPhotoFile(file);
        setFormData(prev => ({
          ...prev,
          passportPhoto: file.name
        }));
        toast.success('Passport photo selected');
      }
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  console.log('📝 Field changed:', name, '=', value);

  setFormData(prev => {
    const updated = { ...prev, [name]: value };

    // Auto-fill WhatsApp if phone changed and whatsapp empty
    if (name === 'phone' && !updated.whatsappNumber) {
      updated.whatsappNumber = value;
    }

    // When course is selected → auto-fill and calculate
    if (name === 'courseId') {
      console.log('🎓 Course changed, finding course with ID:', value);
      
      const selectedCourse = courses.find(c => c._id === value);
      
      console.log('🔍 Found course:', selectedCourse);
      
      if (selectedCourse) {
        updated.courseName = selectedCourse.courseName;
        updated.fullCourseFees = selectedCourse.fees?.toString() || '';

        console.log('⏰ Course duration:', selectedCourse.duration);
        console.log('📅 Registration date:', updated.registrationDate || prev.registrationDate);

        // Calculate end date
        const calculatedEndDate = calculateCourseEndDate(
          updated.registrationDate || prev.registrationDate,
          selectedCourse.duration
        );
        
        updated.courseEndDate = calculatedEndDate;

        if (calculatedEndDate) {
          console.log('✅ SUCCESS! End date calculated:', calculatedEndDate);
          // TOAST REMOVED - Only console log
        } else {
          console.error('❌ FAILED to calculate end date');
          // TOAST REMOVED - Only console log
        }
      } else {
        console.log('⚠️ No course selected, clearing fields');
        updated.courseName = '';
        updated.fullCourseFees = '';
        updated.courseEndDate = '';
      }
    }

    // Recalculate end date when registration date changes
    if (name === 'registrationDate') {
      console.log('📅 Registration date changed to:', value);
      
      const selectedCourse = courses.find(c => c._id === updated.courseId);
      
      if (selectedCourse && value) {
        console.log('🔄 Recalculating end date for course:', selectedCourse.courseName);
        console.log('⏰ Duration:', selectedCourse.duration);
        
        const calculatedEndDate = calculateCourseEndDate(
          value,
          selectedCourse.duration
        );
        
        updated.courseEndDate = calculatedEndDate;

        if (calculatedEndDate) {
          console.log('✅ End date recalculated:', calculatedEndDate);
          // TOAST REMOVED - Only console log
        } else {
          console.error('❌ Failed to recalculate end date');
          // TOAST REMOVED - Only console log
        }
      }
    }

    console.log('📊 Updated formData:', {
      courseId: updated.courseId,
      courseName: updated.courseName,
      duration: courses.find(c => c._id === updated.courseId)?.duration,
      registrationDate: updated.registrationDate,
      courseEndDate: updated.courseEndDate
    });

    return updated;
  });
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Validate course end date
    if (!formData.courseEndDate && formData.courseId) {
      toast.error('Course end date could not be calculated. Please check course duration format.');
      setLoading(false);
      return;
    }

    // Validate date logic
    if (formData.registrationDate && formData.courseEndDate) {
      const regDate = new Date(formData.registrationDate);
      const endDate = new Date(formData.courseEndDate);
      
      if (endDate <= regDate) {
        toast.error('Course end date must be after registration date');
        setLoading(false);
        return;
      }
    }

    // API call to create student
    const response = await fetch('/api/admin/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        ...formData,
        role: 'student'
      })
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Student added successfully!');
      navigate('/admin/students');
    } else {
      toast.error(data.message || 'Failed to add student');
    }
  } catch (error) {
    console.error('Error adding student:', error);
    toast.error('Failed to add student. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/students');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/students')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Student</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Fill in the student information below
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parents Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="student@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>
        </motion.div>

        {/* Registration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Registration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Date
              </label>
              <input
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Course Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Course Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., 12th Pass, Graduate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name <span className="text-red-500">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                disabled={coursesLoading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {coursesLoading ? 'Loading courses...' : '-- Select a Course --'}
                </option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseName} - {course.duration} (₹{course.fees?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID
              </label>
              <input
                type="text"
                value={formData.courseId}
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                placeholder="Auto-filled"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Course Fees
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="fullCourseFees"
                  value={formData.fullCourseFees}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fees Paid Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="feesPaidAmount"
                  value={formData.feesPaidAmount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number
              </label>
              <input
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="12506"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fees Paid Mode
              </label>
              <select
                name="feesPaidMode"
                value={formData.feesPaidMode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Select Payment Mode --</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

     <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roll No <span className="text-red-500">*</span>
          </label>
        <input
          type="text"
          name="rollNo"
          value={formData.rollNo}
          onChange={handleChange}
         required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="e.g., 1001"
        />
      </div>

            {formData.fullCourseFees && formData.feesPaidAmount && (
              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Balance Amount:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ₹{(parseFloat(formData.fullCourseFees) - parseFloat(formData.feesPaidAmount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Address & Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Address & Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Card
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="aadhaarCard"
                  value={formData.aadhaarCard}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter Aadhaar number or upload file"
                />
                <input
                  type="file"
                  id="aadhaarFileInput"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'aadhaar')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('aadhaarFileInput').click()}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {aadhaarFile ? aadhaarFile.name : 'No file chosen'}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport-size photo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="passportPhoto"
                  value={formData.passportPhoto}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Photo URL or upload file"
                  disabled
                />
                <input
                  type="file"
                  id="photoFileInput"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('photoFileInput').click()}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {photoFile ? photoFile.name : 'No file chosen'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Account & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account & Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Code (One-Time Use)
              </label>
              <input
                type="text"
                name="progressCode"
                value={formData.progressCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter progress code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Batch Time
  </label>
  <select
    name="batchTime"
    value={formData.batchTime}
    onChange={handleChange}
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
  >
    <option value="">-- Select Batch Time --</option>
    <option value="7:00 AM - 8:30 AM">7:00 AM - 8:30 AM</option>
    <option value="8:30 AM - 10:00 AM">8:30 AM - 10:00 AM</option>
    <option value="9:30 AM - 11:00 AM">9:30 AM - 11:00 AM</option>
    <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
    <option value="11:30 AM - 1:00 PM">11:30 AM - 1:00 PM</option>
    <option value="3:30 PM - 5:00 PM">3:30 PM - 5:00 PM</option>
    <option value="5:00 PM - 6:30 PM">5:00 PM - 6:30 PM</option>
    <option value="6:30 PM - 8:00 PM">6:30 PM - 8:00 PM</option>
    <option value="8:00 PM - 9:30 PM">8:00 PM - 9:30 PM</option>
  </select>
</div>

            {/* Course End Date - ENHANCED VERSION */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Course End Date
    {formData.courseEndDate && (
      <span className="text-green-600 text-xs ml-2">
        ✓ Auto-calculated
      </span>
    )}
  </label>
  <input
    type="date"
    name="courseEndDate"
    value={formData.courseEndDate}
    readOnly
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
    placeholder="Auto-filled after selecting course & registration date"
  />
  {!formData.courseEndDate && formData.courseId && formData.registrationDate && (
    <p className="text-xs text-amber-600 mt-1">
      ⚠ End date calculation in progress...
    </p>
  )}
  {!formData.courseEndDate && (!formData.courseId || !formData.registrationDate) && (
    <p className="text-xs text-gray-500 mt-1">
      Select course and registration date to auto-calculate
    </p>
  )}
  {formData.courseEndDate && (
    <p className="text-xs text-blue-600 mt-1">
      📅 Calculated from {formData.registrationDate} + course duration
    </p>
  )}
</div>          </div>
        </motion.div>

        {/* Action Buttons */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="flex flex-col sm:flex-row gap-3 justify-center"
>
  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span className="font-medium">Adding Student...</span>
      </>
    ) : (
      <>
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Submit</span>
      </>
    )}
  </button>

  {/* New Registration Button - UPDATED WITH fetchNextRollNo */}
  <button
    type="button"
    onClick={() => {
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        whatsappNumber: '',
        dateOfBirth: '',
        gender: '',
        qualification: '',
        
        parentName: '',
        parentPhone: '',
        emergencyContact: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        aadhaarCard: '',
        passportPhoto: '',
        registrationDate: new Date().toISOString().split('T')[0],
        courseId: '',
        courseName: '',
        rollNo: '',
        fullCourseFees: '',
        feesPaidAmount: '0',
        receiptNumber: '',
        feesPaidMode: '',
        progressCode: '',
        batchTime: '',
        courseEndDate: '',
        teacherName: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      setAadhaarFile(null);
      setPhotoFile(null);
      
      toast.success('Form reset successfully');
    }}
    className="flex items-center justify-center space-x-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
  >
    <span className="font-medium">New Registration</span>
  </button>

  {/* Back Button */}
  <button
    type="button"
    onClick={handleCancel}
    disabled={loading}
    className="flex items-center justify-center space-x-2 px-8 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <X className="w-5 h-5" />
    <span className="font-medium">Back</span>
  </button>
</motion.div>
      </form>
    </div>
  );
};

export default AddStudent;