import { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../../../services/admin.service';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    todayAttendance: 0,
    totalFees: 0,
    todayFees: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents.toString(), icon: Users, color: 'blue' },
    { title: 'Active Students', value: stats.activeStudents.toString(), icon: Users, color: 'green' },
    { title: 'Total Courses', value: stats.totalCourses.toString(), icon: BookOpen, color: 'purple' },
    { title: 'Today\'s Attendance', value: stats.todayAttendance.toString(), icon: Calendar, color: 'yellow' },
    { title: 'Total Fees Collected', value: `₹${stats.totalFees.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { title: 'Today\'s Fees', value: `₹${stats.todayFees.toLocaleString()}`, icon: DollarSign, color: 'blue' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <p className="text-gray-600">No recent activities</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/admin/students/add')}
              className="btn btn-primary w-full"
            >
              Add New Student
            </button>
            <button 
              onClick={() => navigate('/admin/attendance')}
              className="btn btn-secondary w-full"
            >
              Mark Attendance
            </button>
            <button 
              onClick={() => navigate('/admin/fees')}
              className="btn btn-secondary w-full"
            >
              Record Fee Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

