import { useEffect, useState } from 'react';
import { getAttendance } from '../../../services/student.service';
import toast from 'react-hot-toast';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  BookOpen,
  Users,
  AlertTriangle
} from 'lucide-react';

const AttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getAttendance();
      if (response.success) {
        setAttendance(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter(r => r.attendance === 'Present').length,
    absent: attendance.filter(r => r.attendance === 'Absent').length,
    percentage: attendance.length > 0 
      ? ((attendance.filter(r => r.attendance === 'Present').length / attendance.length) * 100).toFixed(1)
      : 0
  };

  // Filter attendance
  const filteredAttendance = attendance.filter(record => {
    if (filterStatus === 'all') return true;
    return record.attendance.toLowerCase() === filterStatus.toLowerCase();
  });

  // Get month name
  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <Calendar className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Attendance
            </h1>
            <p className="text-slate-600 mt-2">Track your attendance records</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105">
            <Download className="w-5 h-5" />
            <span className="font-medium">Export Report</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Days Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Total Days</p>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>

        {/* Present Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Present</p>
            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          </div>
        </div>

        {/* Absent Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
          </div>
        </div>

        {/* Percentage Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                stats.percentage >= 75 
                  ? 'bg-green-100 text-green-600' 
                  : stats.percentage >= 60
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {stats.percentage >= 75 ? 'Good' : stats.percentage >= 60 ? 'Warning' : 'Low'}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">Attendance</p>
            <p className="text-3xl font-bold text-purple-600">{stats.percentage}%</p>
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  stats.percentage >= 75 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : stats.percentage >= 60
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {stats.percentage < 75 && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Attendance Warning</p>
            <p className="text-sm text-yellow-700 mt-1">
              Your attendance is below 75%. You need {Math.ceil((0.75 * stats.total - stats.present))} more present days to reach the minimum requirement.
            </p>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with Filters */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <span>Attendance Records</span>
              </h2>
              <p className="text-sm text-slate-600 mt-1">{filteredAttendance.length} records found</p>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-700">
                {monthName}
              </span>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('present')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === 'present'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Present
              </button>
              <button
                onClick={() => setFilterStatus('absent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === 'absent'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Absent
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredAttendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No attendance records found</p>
            <p className="text-sm text-slate-400 mt-1">Your attendance will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Course</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Batch</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Day</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => {
                  const date = new Date(record.attendanceDate);
                  const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
                  const isPresent = record.attendance === 'Present';
                  
                  return (
                    <tr 
                      key={record._id} 
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isPresent 
                              ? 'bg-gradient-to-br from-green-100 to-green-200' 
                              : 'bg-gradient-to-br from-red-100 to-red-200'
                          }`}>
                            <Clock className={`w-5 h-5 ${isPresent ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-slate-500">{dayName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                          isPresent
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isPresent ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span>{record.attendance}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 text-slate-700">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>{record.course || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 text-slate-700">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{record.batchTime || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                          {date.toLocaleDateString('en-IN', { weekday: 'long' })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;