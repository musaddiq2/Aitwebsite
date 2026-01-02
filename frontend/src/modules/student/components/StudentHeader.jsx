import { useAuth } from '../../../hooks/useAuth';
import { Bell, User, Search, Moon, Sun, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const StudentHeader = () => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title with animated gradient */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <h1 className="relative text-2xl md:text-3xl font-bold text-white tracking-tight">
                Student Dashboard
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block">
              {showSearch ? (
                <div className="relative w-64 transition-all duration-300">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white placeholder-indigo-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    autoFocus
                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Messages */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-lg animate-pulse">
                2
              </span>
            </button>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-lg">
                5
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-white/30 ml-2">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-white leading-tight">
                  {user?.fullName || 'Student'}
                </p>
                <p className="text-xs text-indigo-100">{user?.email}</p>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                <div className="relative w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/50 cursor-pointer hover:scale-105 transition-transform">
                  {user?.fullName?.charAt(0) || <User className="w-6 h-6" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;