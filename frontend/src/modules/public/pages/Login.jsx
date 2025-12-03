import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../../../store/authSlice';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { fadeInUp, scaleIn, staggerContainer, staggerItem } from '../../../utils/animations';
import AnimatedButton from '../../../components/AnimatedButton';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={scaleIn.initial}
        animate={scaleIn.animate}
        transition={scaleIn.transition}
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItem}>
            <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* Test Credentials Quick Login */}
          <motion.div 
            variants={staggerItem}
            className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg"
          >
            <p className="text-xs font-medium text-gray-700 mb-2">Quick Test Login:</p>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full px-4 py-2 bg-white border-2 border-primary-600 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
            >
              Use Admin Test Credentials
            </button>
            {showTestCredentials && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-gray-600"
              >
                <p>Email: admin@test.com</p>
                <p>Password: admin123</p>
              </motion.div>
            )}
          </motion.div>

          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div className="space-y-4" variants={staggerItem}>
              <div className="relative">
                <motion.div
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  animate={{
                    color: focusedField === 'email' ? '#0284c7' : '#9ca3af',
                    scale: focusedField === 'email' ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail size={20} />
                </motion.div>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <div className="relative">
                <motion.div
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  animate={{
                    color: focusedField === 'password' ? '#0284c7' : '#9ca3af',
                    scale: focusedField === 'password' ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock size={20} />
                </motion.div>
                <motion.input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="w-full group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                {!isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatedButton>
            </motion.div>

            <motion.p
              className="text-center text-sm text-gray-600"
              variants={staggerItem}
            >
              Don't have an account?{' '}
              <Link
                to="/home"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center group"
              >
                Return to home
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

