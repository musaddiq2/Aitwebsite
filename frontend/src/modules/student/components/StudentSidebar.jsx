import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  DollarSign,
  FileText,
  Award,
  Bell,
  LogOut,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const StudentSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/profile', icon: User, label: 'My Profile' },
    { path: '/student/attendance', icon: Calendar, label: 'Attendance' },
    { path: '/student/fees', icon: DollarSign, label: 'Fees' },
    { path: '/student/exams', icon: FileText, label: 'My Exams' },
    { path: '/student/results', icon: FileText, label: 'Results' },
    { path: '/student/leave', icon: Calendar, label: 'Apply Leave' },
    { path: '/student/certificate', icon: Award, label: 'Certificate' },
    { path: '/student/notifications', icon: Bell, label: 'Notifications' },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/home');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col h-screen shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Student Portal</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;

