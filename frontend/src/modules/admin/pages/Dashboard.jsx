import { useEffect, useState, useMemo } from 'react';
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, UserCheck, Plus, ClipboardList, Bell, Search, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Import your actual service - adjust the path as needed
// import { getDashboardStats } from '../../../services/admin.service';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    todayAttendance: 0,
    totalFees: 0,
    todayFees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  // Fetch dashboard data from your API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // **REPLACE THIS WITH YOUR ACTUAL API CALL**
      // Uncomment the line below and remove the fetch call
      // const response = await getDashboardStats();
      
      // Using fetch to call your backend API
      const token = localStorage.getItem('token'); // Adjust based on how you store auth token
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived stats from database data
  const derivedStats = useMemo(() => ({
    studentGrowth: stats.activeStudents > 0 
      ? ((stats.activeStudents / stats.totalStudents) * 100).toFixed(1) 
      : 0,
    attendanceRate: stats.totalStudents > 0 
      ? ((stats.todayAttendance / stats.totalStudents) * 100).toFixed(1) 
      : 0,
    feeCollection: stats.totalFees > 0 
      ? ((stats.todayFees / stats.totalFees) * 100).toFixed(1) 
      : 0
  }), [stats]);

  // Recent activities - you can fetch this from your API too
  const recentActivities = [
    { id: 1, type: 'student', message: 'New student enrolled: Rahul Sharma', time: '5 min ago', color: 'blue' },
    { id: 2, type: 'fees', message: 'Fee payment received: ₹15,000', time: '15 min ago', color: 'green' },
    { id: 3, type: 'attendance', message: 'Attendance marked for Batch A', time: '1 hour ago', color: 'yellow' },
    { id: 4, type: 'course', message: 'New course added: Web Development Pro', time: '2 hours ago', color: 'purple' }
  ];

  // Attendance trend data
  const attendanceTrend = useMemo(() => [
    { day: 'Mon', rate: 92 },
    { day: 'Tue', rate: 88 },
    { day: 'Wed', rate: 95 },
    { day: 'Thu', rate: 91 },
    { day: 'Fri', rate: 94 },
    { day: 'Sat', rate: 89 },
    { day: 'Sun', rate: 86 }
  ], []);

  const statCards = [
    { 
      title: 'Total Students', 
      value: stats.totalStudents?.toString() || '0', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      change: derivedStats.studentGrowth,
      changeType: 'positive'
    },
    { 
      title: 'Active Students', 
      value: stats.activeStudents?.toString() || '0', 
      icon: UserCheck, 
      color: 'from-green-500 to-green-600',
      change: ((stats.activeStudents / stats.totalStudents) * 100).toFixed(1) || 0,
      changeType: 'positive'
    },
    { 
      title: 'Total Courses', 
      value: stats.totalCourses?.toString() || '0', 
      icon: BookOpen, 
      color: 'from-purple-500 to-purple-600',
      change: 0,
      changeType: 'positive'
    },
    { 
      title: 'Today\'s Attendance', 
      value: stats.todayAttendance?.toString() || '0', 
      icon: Calendar, 
      color: 'from-yellow-500 to-yellow-600',
      change: derivedStats.attendanceRate,
      changeType: 'positive'
    },
    { 
      title: 'Total Fees Collected', 
      value: `₹${(stats.totalFees / 100000).toFixed(1)}L` || '₹0', 
      icon: DollarSign, 
      color: 'from-emerald-500 to-emerald-600',
      change: derivedStats.feeCollection,
      changeType: 'positive'
    },
    { 
      title: 'Today\'s Collection', 
      value: `₹${stats.todayFees?.toLocaleString() || '0'}`, 
      icon: TrendingUp, 
      color: 'from-indigo-500 to-indigo-600',
      change: 0,
      changeType: 'positive'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-900 font-semibold text-xl mb-2">Error Loading Dashboard</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}%</span>
                </div>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Attendance Trend</h2>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {attendanceTrend.map((item) => (
              <div key={item.day} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-12">{item.day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${item.rate}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{item.rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 group">
                <div className={`w-10 h-10 rounded-xl bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Add Student', color: 'blue', path: '/admin/students/add' },
            { icon: ClipboardList, label: 'Mark Attendance', color: 'green', path: '/admin/attendance' },
            { icon: DollarSign, label: 'Record Payment', color: 'purple', path: '/admin/fees' },
            { icon: BookOpen, label: 'Add Course', color: 'yellow', path: '/admin/courses/add' }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`group p-6 rounded-xl border-2 border-gray-200 hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all duration-300 text-left`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-${action.color}-600 transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Click to {action.label.toLowerCase()}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;