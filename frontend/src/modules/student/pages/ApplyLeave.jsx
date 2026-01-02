import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as studentService from '../../../services/student.service';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Plus,
  X,
  FileText,
  User,
  Info,
  CalendarCheck,
  CalendarX,
  TrendingUp
} from 'lucide-react';

const ApplyLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);

  const [formData, setFormData] = useState({
    leaveType: 'Sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await studentService.getLeaves();
      setLeaves(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leaves');
      console.error('Fetch leaves error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate > endDate) {
      toast.error('Start date must be before end date');
      return;
    }

    if (startDate < today && !editingLeave) {
      toast.error('Start date cannot be in the past');
      return;
    }

    try {
      setSubmitting(true);
      if (editingLeave) {
        await studentService.updateLeave(editingLeave._id, formData);
        toast.success('Leave updated successfully');
      } else {
        await studentService.applyLeave(formData);
        toast.success('Leave application submitted successfully');
      }
      
      setShowForm(false);
      setEditingLeave(null);
      setFormData({
        leaveType: 'Sick',
        startDate: '',
        endDate: '',
        reason: ''
      });
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setFormData({
      leaveType: leave.leaveType,
      startDate: leave.startDate.split('T')[0],
      endDate: leave.endDate.split('T')[0],
      reason: leave.reason
    });
    setShowForm(true);
  };

  const handleDelete = async (leaveId) => {
    if (!window.confirm('Are you sure you want to delete this leave application?')) {
      return;
    }

    try {
      await studentService.deleteLeave(leaveId);
      toast.success('Leave deleted successfully');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete leave');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLeave(null);
    setFormData({
      leaveType: 'Sick',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        gradient: 'from-yellow-500 to-yellow-600'
      },
      Approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle2,
        gradient: 'from-green-500 to-green-600'
      },
      Rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        gradient: 'from-red-500 to-red-600'
      }
    };
    return configs[status] || configs.Pending;
  };

  const getLeaveTypeIcon = (type) => {
    const icons = {
      Sick: '🤒',
      Personal: '👤',
      Emergency: '🚨',
      Other: '📝'
    };
    return icons[type] || '📋';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  // Calculate stats
  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'Pending').length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <Calendar className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading leave data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Leave Management
        </h1>
        <p className="text-slate-600 mt-2">Submit and track your leave applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Apply Leave Button */}
      {!showForm && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Need Time Off?</h2>
              <p className="text-indigo-100">Submit your leave application quickly and easily</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:shadow-xl transition-all hover:scale-105 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      )}

      {/* Leave Application Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingLeave ? 'Edit Leave Application' : 'New Leave Application'}
                </h2>
                <p className="text-indigo-100 mt-1">Fill in the details below</p>
              </div>
              <button
                onClick={handleCancel}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Leave Type *
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Sick">🤒 Sick Leave</option>
                <option value="Personal">👤 Personal Leave</option>
                <option value="Emergency">🚨 Emergency Leave</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Total Days Preview */}
            {formData.startDate && formData.endDate && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Duration</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {calculateDays(formData.startDate, formData.endDate)} Days
                  </p>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Reason for Leave *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please provide a detailed reason for your leave request..."
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>{editingLeave ? 'Update Application' : 'Submit Application'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Applications List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>My Leave Applications</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">{leaves.length} total applications</p>
        </div>

        {leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <CalendarX className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-lg">No leave applications yet</p>
            <p className="text-sm text-slate-400 mt-2">Click "Apply for Leave" to create your first application</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {leaves.map((leave) => {
              const statusConfig = getStatusConfig(leave.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={leave._id}
                  className="border-2 border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                        {getLeaveTypeIcon(leave.leaveType)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {leave.leaveType} Leave
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Applied on {formatDate(leave.appliedDate)}</span>
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{leave.status}</span>
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium mb-1">Start Date</p>
                      <p className="text-sm font-bold text-slate-800">{formatDate(leave.startDate)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium mb-1">End Date</p>
                      <p className="text-sm font-bold text-slate-800">{formatDate(leave.endDate)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-medium mb-1">Total Days</p>
                      <p className="text-sm font-bold text-indigo-600">{leave.totalDays} day(s)</p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 font-medium mb-2">Reason</p>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-700">{leave.reason}</p>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {leave.rejectionReason && (
                    <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <p className="text-sm text-red-900 font-semibold mb-2 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Rejection Reason</span>
                      </p>
                      <p className="text-red-800">{leave.rejectionReason}</p>
                    </div>
                  )}

                  {/* Approval Info */}
                  {leave.approvedBy && (
                    <div className={`mb-4 p-4 rounded-xl border-2 ${
                      leave.status === 'Approved' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <User className={`w-4 h-4 ${leave.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`} />
                        <p className={`text-sm font-medium ${leave.status === 'Approved' ? 'text-green-800' : 'text-red-800'}`}>
                          {leave.status} by {leave.approvedBy.firstName} {leave.approvedBy.lastName} on {formatDate(leave.approvedDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {leave.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
                      <button
                        onClick={() => handleEdit(leave)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(leave._id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guidelines Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-3 text-lg">Leave Application Guidelines</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Apply for leave at least 2-3 days in advance whenever possible</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>You can only edit or delete pending leave applications</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Provide a clear and detailed reason for your leave request</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Emergency leaves should be applied as soon as possible</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>Check your application status regularly for updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;