import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import installmentRoutes from './routes/installment.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import examRoutes from './routes/exam.routes.js';
import questionRoutes from './routes/question.routes.js';
import resultRoutes from './routes/result.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import publicRoutes from './routes/public.routes.js';
import loginHistoryRoutes from './routes/loginHistory.routes.js';
// Import middleware
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { setupSwagger } from './configs/swagger.js';

const app = express();

// ==================== Middleware ====================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ==================== Routes ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/installments', installmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/login-history', loginHistoryRoutes);
// ==================== Swagger Documentation ====================

if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// ==================== Error Handling ====================

app.use(notFound);
app.use(errorHandler);

export default app;

