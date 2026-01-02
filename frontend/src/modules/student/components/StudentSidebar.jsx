import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  DollarSign,
  FileText,
  Award,
  Bell,
  LogOut,
  Home,
  Settings,
  ChevronRight,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import { useState, useEffect } from 'react';

const StudentSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { 
      path: '/student/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/student/profile', 
      icon: User, 
      label: 'Profile',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      path: '/student/attendance', 
      icon: Calendar, 
      label: 'Attendance',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      path: '/student/fees', 
      icon: DollarSign, 
      label: 'Fees',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      path: '/student/exams', 
      icon: FileText, 
      label: 'Exams',
      gradient: 'from-red-500 to-red-600'
    },
    { 
      path: '/student/results', 
      icon: TrendingUp, 
      label: 'Results',
      gradient: 'from-pink-500 to-pink-600'
    },
    { 
      path: '/student/leave', 
      icon: Calendar, 
      label: 'Leave',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      path: '/student/certificate', 
      icon: Award, 
      label: 'Certificates',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      path: '/student/notifications', 
      icon: Bell, 
      label: 'Notifications', 
      badge: 3,
      gradient: 'from-cyan-500 to-cyan-600'
    },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/home');
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 border-r border-slate-200 flex flex-col h-screen transition-all duration-300 shadow-xl`}>
      {/* Header with Logo */}
      <div className="p-6 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EduPortal
                </h2>
                <p className="text-xs text-slate-500">Student Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-indigo-600 border border-slate-200"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
              <p className="text-xs text-green-700 font-medium">Attendance</p>
              <p className="text-xl font-bold text-green-600">92%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">CGPA</p>
              <p className="text-xl font-bold text-blue-600">8.5</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-between'
              } px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/50 scale-[1.02]`
                  : 'text-slate-600 hover:bg-white hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </div>
              
              {/* Badge */}
              {item.badge && (
                <>
                  {!isCollapsed ? (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Active Indicator */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className={`grid ${isCollapsed ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-2'}`}>
          <Link
            to="/home"
            className="flex items-center justify-center p-3 rounded-xl bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 text-slate-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md border border-slate-200 hover:border-blue-300"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            to="/student/settings"
            className="flex items-center justify-center p-3 rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 text-slate-600 hover:text-purple-600 transition-all shadow-sm hover:shadow-md border border-slate-200 hover:border-purple-300"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all shadow-sm hover:shadow-lg border border-red-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;