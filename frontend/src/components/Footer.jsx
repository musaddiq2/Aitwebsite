import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '../utils/animations';

const Footer = () => {
  const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/courses', label: 'Courses' },
    { to: '/contact', label: 'Contact' },
  ];

  const resources = [
    { to: '/faq', label: 'FAQ' },
    { to: '/gallery', label: 'Gallery' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 border-t border-gray-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          <motion.div variants={staggerItem}>
            <motion.h3
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              AIT Platform
            </motion.h3>
            <p className="text-gray-600 leading-relaxed">
              Leading educational ERP and LMS platform for modern learning. Empowering students and educators worldwide.
            </p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h4 className="font-semibold mb-6 text-lg text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h4 className="font-semibold mb-6 text-lg text-gray-900">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <motion.li
                  key={resource.to}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={resource.to}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {resource.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h4 className="font-semibold mb-6 text-lg text-gray-900">Contact</h4>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
                className="text-gray-600"
              >
                <a href="mailto:info@aitplatform.com" className="hover:text-primary-600 transition-colors">
                  info@aitplatform.com
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ x: 5 }}
                className="text-gray-600"
              >
                <a href="tel:+911234567890" className="hover:text-primary-600 transition-colors">
                  +91 1234567890
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-gray-200 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} AIT Platform. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

