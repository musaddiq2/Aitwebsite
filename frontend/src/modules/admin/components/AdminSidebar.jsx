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
  Menu,
  X,
  ClipboardList,
  Award,
  UserX,
  Clock
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { path: '/admin/attendance', icon: Calendar, label: 'Attendance' },
    { path: '/admin/fees', icon: DollarSign, label: 'Fees' },
    { path: '/admin/exams', icon: ClipboardList, label: 'Exams' },
    { path: '/admin/exams/results', icon: Award, label: 'Exam Results' },
    { path: '/admin/questions', icon: FileText, label: 'Questions' },
    { path: '/admin/results', icon: Award, label: 'Results' },
    { path: '/admin/leaves', icon: UserX, label: 'Leaves' },
    { path: '/admin/certificates', icon: Award, label: 'Certificates' },
    { path: '/admin/login-history', icon: Clock, label: 'Login History' },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/home');
    setIsMobileMenuOpen(false);
  };

  const handleMenuClick = () => {
    // Close mobile menu when a link is clicked
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:bg-gray-100"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 
          flex flex-col h-screen shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">AIT Admin</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg 
                  transition-all duration-200 ease-in-out
                  group relative overflow-hidden
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-800" />
                )}
                
                <Icon 
                  className={`
                    w-5 h-5 transition-transform duration-200
                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                  `} 
                />
                <span className="font-medium">{item.label}</span>
                
                {/* Hover effect background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 rounded-lg" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="
              flex items-center space-x-3 w-full px-4 py-3 rounded-lg 
              text-red-600 hover:bg-red-50 transition-all duration-200
              group
            "
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;