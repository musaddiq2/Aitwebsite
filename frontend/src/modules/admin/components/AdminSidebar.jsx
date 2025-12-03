import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { path: '/admin/attendance', icon: Calendar, label: 'Attendance' },
    { path: '/admin/fees', icon: DollarSign, label: 'Fees' },
    { path: '/admin/exams', icon: FileText, label: 'Exams' },
    { path: '/admin/questions', icon: FileText, label: 'Questions' },
    { path: '/admin/results', icon: FileText, label: 'Results' },
    { path: '/admin/leaves', icon: Calendar, label: 'Leaves' },
    { path: '/admin/certificates', icon: FileText, label: 'Certificates' },
    { path: '/admin/login-history', icon: Settings, label: 'Login History' },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/home');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col h-screen shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">AIT Admin</h2>
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

export default AdminSidebar;

