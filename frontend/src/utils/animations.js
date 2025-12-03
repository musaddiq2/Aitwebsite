// Reusable animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Transition presets
export const smoothTransition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96], // Custom easing
};

export const quickTransition = {
  duration: 0.3,
  ease: [0.43, 0.13, 0.23, 0.96],
};

export const slowTransition = {
  duration: 0.8,
  ease: [0.43, 0.13, 0.23, 0.96],
};

// Button hover animations
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

// Card hover animations
export const cardHover = {
  y: -8,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.3 },
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: smoothTransition,
};

