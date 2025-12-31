import { Routes, Route } from 'react-router-dom';
import Dashboard from '../modules/admin/pages/Dashboard';
import Students from '../modules/admin/pages/Students';
import AddStudent from '../modules/admin/pages/AddStudent';
import Courses from '../modules/admin/pages/Courses';
import Attendance from '../modules/admin/pages/Attendance';
import Fees from '../modules/admin/pages/Fees';                          // ← ADD THIS
import Exams from '../modules/admin/pages/Exams';                        // ← ADD THIS
import ExamCreate from '../modules/admin/pages/ExamCreate';
import ExamQuestions from '../modules/admin/pages/ExamQuestions';
import ExamResults from '../modules/admin/pages/ExamResults';
import Results from '../modules/admin/pages/Results';
import Leaves from '../modules/admin/pages/Leaves';
import Certificates from '../modules/admin/pages/Certificates';
import LoginHistory from '../modules/admin/pages/LoginHistory';
import CourseDetails from '../modules/admin/pages/CourseDetails';
import EditCourse from '../modules/admin/pages/EditCourse';
import InstallmentList from '../modules/admin/pages/InstallmentList';
import AddInstallment from '../modules/admin/pages/AddInstallment';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="students" element={<Students />} />
      <Route path="students/add" element={<AddStudent />} />
      <Route path="courses" element={<Courses />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="fees" element={<Fees />} />
      <Route path="fees/installments" element={<InstallmentList />} />
      <Route path="fees/add" element={<AddInstallment />} />
      <Route path="exams" element={<Exams />} />
      <Route path="exams/create" element={<ExamCreate />} />      
      <Route path="exams/edit/:id" element={<ExamCreate />} />      
      <Route path="exams/questions/:id" element={<ExamQuestions />} />      
      <Route path="exams/results" element={<ExamResults />} />      
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

