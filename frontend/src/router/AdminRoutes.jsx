import { Routes, Route } from 'react-router-dom';
import Dashboard from '../modules/admin/pages/Dashboard';
import Students from '../modules/admin/pages/Students';
import AddStudent from '../modules/admin/pages/AddStudent';
import Courses from '../modules/admin/pages/Courses';
import Attendance from '../modules/admin/pages/Attendance';
import Fees from '../modules/admin/pages/Fees';
import Exams from '../modules/admin/pages/Exams';
import Questions from '../modules/admin/pages/Questions';
import Results from '../modules/admin/pages/Results';
import Leaves from '../modules/admin/pages/Leaves';
import Certificates from '../modules/admin/pages/Certificates';
import LoginHistory from '../modules/admin/pages/LoginHistory';
import CourseDetails from '../modules/admin/pages/CourseDetails';
import EditCourse from '../modules/admin/pages/EditCourse';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="students" element={<Students />} />
      <Route path="students/add" element={<AddStudent />} />
      <Route path="courses" element={<Courses />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="fees" element={<Fees />} />
      <Route path="exams" element={<Exams />} />
      <Route path="questions" element={<Questions />} />
      <Route path="results" element={<Results />} />
      <Route path="leaves" element={<Leaves />} />
      <Route path="certificates" element={<Certificates />} />
      <Route path="login-history" element={<LoginHistory />} />
      <Route path="courses/edit/:id" element={<EditCourse />} /> 
      <Route path="courses/:id" element={<CourseDetails />} />       
    </Routes>
  );
};

export default AdminRoutes;

