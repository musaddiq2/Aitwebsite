import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buttonHover, buttonTap } from '../utils/animations';

const AnimatedButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  to,
  as,
  ...props 
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center shadow-sm';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 hover:shadow-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-400 border border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 hover:shadow-md',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500 shadow-none',
  };

  const motionProps = {
    className: `${baseClasses} ${variantClasses[variant]} ${className}`,
    whileHover: !disabled ? buttonHover : {},
    whileTap: !disabled ? buttonTap : {},
    ...props,
  };

  // If 'to' prop is provided, render as Link
  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className="w-full h-full flex items-center justify-center">
          {children}
        </Link>
      </motion.div>
    );
  }

  // If 'as' prop is provided, render as that component
  if (as) {
    const Component = as;
    return (
      <motion.div {...motionProps}>
        <Component className="w-full h-full flex items-center justify-center">
          {children}
        </Component>
      </motion.div>
    );
  }

  // Default: render as button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;

