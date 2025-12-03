import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import ExamSession from '../models/exam/ExamSession.model.js';
import logger from '../configs/logger.js';

export const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || user.isDeleted || user.status === 'Inactive') {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`✅ User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join role-based room
    socket.join(`role:${socket.userRole}`);

    // Exam session handling
    socket.on('join-exam', async (data) => {
      const { examId } = data;
      const examRoom = `exam:${examId}`;
      socket.join(examRoom);
      
      // Update exam session in MongoDB (mark as connected)
      try {
        await ExamSession.findOneAndUpdate(
          { userId: socket.userId, examId },
          { $set: { connected: true } },
          { upsert: false }
        );
      } catch (error) {
        logger.error('Failed to update exam session:', error);
      }

      socket.emit('exam-joined', { examId, room: examRoom });
    });

    // Handle exam answer updates
    socket.on('exam-answer', async (data) => {
      const { examId, questionId, answer } = data;
      
      try {
        const session = await ExamSession.findOne({ userId: socket.userId, examId });
        if (session) {
          const answers = session.answers || {};
          answers[questionId] = answer;
          session.answers = answers;
          await session.save();
        }
      } catch (error) {
        logger.error('Failed to store exam answer:', error);
      }
      
      // Broadcast to admin monitoring (if needed)
      socket.to(`exam:${examId}:admin`).emit('answer-updated', {
        userId: socket.userId,
        questionId,
        answer
      });
    });

    // Handle exam timer sync
    socket.on('exam-timer-sync', async (data) => {
      const { examId, remainingTime } = data;
      
      // Timer is already stored in ExamSession model, no need to sync separately
      // This is just for client-side sync if needed
      try {
        // Could store in session if needed, but not critical
      } catch (error) {
        logger.error('Failed to sync exam timer:', error);
      }
    });

    // Handle exam submission
    socket.on('exam-submit', async (data) => {
      const { examId } = data;
      
      // Session will be deleted by the exam controller after submission
      // Just mark as submitted if needed
      try {
        await ExamSession.findOneAndUpdate(
          { userId: socket.userId, examId },
          { $set: { submitted: true } }
        );
      } catch (error) {
        logger.error('Failed to update exam session:', error);
      }
      
      socket.leave(`exam:${examId}`);
      socket.emit('exam-submitted', { examId });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      logger.info(`❌ User disconnected: ${socket.userId}`);
      
      // Clean up exam sessions (optional - keep for reconnection)
      // You might want to keep the session for a few minutes in case of network issues
    });

    // Admin monitoring
    if (socket.userRole === 'admin') {
      socket.on('monitor-exam', (data) => {
        const { examId } = data;
        socket.join(`exam:${examId}:admin`);
      });
    }
  });

  return io;
};

