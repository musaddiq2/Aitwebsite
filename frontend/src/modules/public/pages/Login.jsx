import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../../store/authSlice';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@test.com',
        password: 'admin123',
      });
      setShowTestCredentials(true);
      toast.success('Admin credentials filled! Click Sign in to login.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(login(formData)).unwrap();
      
      if (result.success) {
        toast.success('Login successful!');
        // Redirect based on user role
        const userRole = result.data.user.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs with animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Login card */}
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        {/* Decorative top accent */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Quick test login */}
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <p className="text-xs font-semibold text-cyan-300">Quick Test Login</p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/50"
            >
              Use Admin Test Credentials
            </button>
            {showTestCredentials && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1 animate-fadeIn">
                <p>📧 admin@test.com</p>
                <p>🔑 admin123</p>
              </div>
            )}
          </div>

          {/* Login form */}
          <div className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${
                  focusedField === 'email' ? 'text-cyan-400' : 'text-slate-400'
                }`} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-slate-400 outline-none transition-all duration-300 ${
                    focusedField === 'email'
                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 bg-white/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${
                  focusedField === 'password' ? 'text-cyan-400' : 'text-slate-400'
                }`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-slate-400 outline-none transition-all duration-300 ${
                    focusedField === 'password'
                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 bg-white/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-slate-300">
              Don't have an account?{' '}
              <Link
                to="/home"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Return to home
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;