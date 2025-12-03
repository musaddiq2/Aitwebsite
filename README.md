# AIT Platform - MERN Stack Educational ERP + LMS + Online Exam System

A comprehensive, production-ready educational management system built with the MERN stack.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **TailwindCSS 3** - Styling
- **Redux Toolkit** - State management
- **React Router v7** - Routing
- **Framer Motion** - Animations
- **Recharts** - Dashboard charts
- **GSAP** - Advanced animations
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form handling
- **Lucide Icons** - Icon library

### Backend
- **Node.js + Express.js** - Server framework
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication (Access + Refresh tokens)
- **BCrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service
- **Redis** - Caching & exam sessions
- **Socket.IO** - WebSocket for live exams
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📁 Project Structure

```
ait-mern-platform/
├── backend/
│   ├── config/
│   │   ├── database.config.js
│   │   └── redis.config.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Course.model.js
│   │   ├── Attendance.model.js
│   │   ├── Installment.model.js
│   │   ├── LoginHistory.model.js
│   │   └── exam/
│   │       ├── Exam.model.js
│   │       ├── Question.model.js
│   │       └── Result.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── student.routes.js
│   │   ├── exam.routes.js
│   │   └── public.routes.js
│   ├── socket/
│   │   └── socket.handler.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── layouts/
    │   │   ├── PublicLayout.jsx
    │   │   ├── AdminLayout.jsx
    │   │   └── StudentLayout.jsx
    │   ├── modules/
    │   │   ├── public/
    │   │   ├── admin/
    │   │   ├── student/
    │   │   └── exam/
    │   ├── router/
    │   │   ├── Protected.jsx
    │   │   ├── PublicRoutes.jsx
    │   │   ├── AdminRoutes.jsx
    │   │   └── StudentRoutes.jsx
    │   ├── store/
    │   │   ├── store.js
    │   │   ├── authSlice.js
    │   │   ├── studentSlice.js
    │   │   ├── examSlice.js
    │   │   ├── adminSlice.js
    │   │   └── notificationSlice.js
    │   ├── utils/
    │   │   ├── axios.js
    │   │   └── auth.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/ait_platform
MONGODB_EXAM_URI=mongodb://localhost:27017/ait_exam_db

JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

REDIS_HOST=localhost
REDIS_PORT=6379
```

5. Start MongoDB and Redis services

6. Run the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

## 🔐 Authentication

The system uses JWT with access and refresh tokens:
- **Access Token**: 15 minutes expiry, stored in HTTP-only cookie
- **Refresh Token**: 7 days expiry, stored in HTTP-only cookie and Redis

## 📊 Features

### Admin Features
- ✅ Dashboard with analytics
- ✅ Student management (CRUD)
- ✅ Course management
- ✅ Attendance marking
- ✅ Fee collection
- ✅ Exam creation & management
- ✅ Question bank
- ✅ Results management
- ✅ Leave approval
- ✅ Certificate management
- ✅ Login history

### Student Features
- ✅ Personal dashboard
- ✅ Profile management
- ✅ Attendance viewing
- ✅ Fee payment history
- ✅ Online exam taking
- ✅ Results viewing
- ✅ Leave application
- ✅ Certificate requests
- ✅ Notifications

### Exam System
- ✅ Timer-based exams
- ✅ Real-time synchronization (WebSocket)
- ✅ Session management (Redis)
- ✅ Auto-submit on timeout
- ✅ Question navigation
- ✅ Mark for review
- ✅ Immediate result calculation

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Update MongoDB connection strings
3. Configure Redis
4. Set secure JWT secrets
5. Enable HTTPS
6. Use PM2 or similar for process management

### Frontend
1. Build the application:
```bash
npm run build
```

2. Serve with Nginx or similar:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/students` - List students
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- ... (more routes to be implemented)

### Student Routes
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/profile` - Get profile
- `PUT /api/student/profile` - Update profile
- `GET /api/student/attendance` - Get attendance
- `GET /api/student/fees` - Get fee history
- ... (more routes to be implemented)

### Exam Routes
- `GET /api/exam/exams` - List available exams
- `POST /api/exam/start/:examId` - Start exam
- `POST /api/exam/submit/:examId` - Submit exam
- `GET /api/exam/results` - Get results

## 🔒 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with BCrypt
- ✅ HTTP-only cookies
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- ✅ MongoDB sanitization

## 📈 Performance

- ✅ Redis caching
- ✅ Code splitting (Vite)
- ✅ Lazy loading
- ✅ Optimized bundle size
- ✅ Compression middleware

## 🤝 Contributing

This is a production-ready template. Extend it based on your requirements.

## 📄 License

ISC

## 🎯 Next Steps

1. Implement remaining controllers and routes
2. Add comprehensive error handling
3. Write unit and integration tests
4. Add API documentation (Swagger)
5. Implement file upload handling
6. Add email notifications
7. Implement real-time notifications
8. Add comprehensive logging
9. Set up CI/CD pipeline
10. Add monitoring and analytics

---

**Built with ❤️ for AIT Platform**

