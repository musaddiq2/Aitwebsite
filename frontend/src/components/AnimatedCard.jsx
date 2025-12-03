import { motion } from 'framer-motion';
import { cardHover, fadeInUp } from '../utils/animations';

const AnimatedCard = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ ...fadeInUp.transition, delay }}
      whileHover={hover ? cardHover : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;

