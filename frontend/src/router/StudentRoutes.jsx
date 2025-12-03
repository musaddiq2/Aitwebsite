import { Routes, Route } from 'react-router-dom';
import StudentDashboard from '../modules/student/pages/StudentDashboard';
import MyProfile from '../modules/student/pages/MyProfile';
import AttendanceView from '../modules/student/pages/AttendanceView';
import FeesHistory from '../modules/student/pages/FeesHistory';
import MyExams from '../modules/student/pages/MyExams';
import MyResults from '../modules/student/pages/MyResults';
import ApplyLeave from '../modules/student/pages/ApplyLeave';
import RequestCertificate from '../modules/student/pages/RequestCertificate';
import Notifications from '../modules/student/pages/Notifications';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="profile" element={<MyProfile />} />
      <Route path="attendance" element={<AttendanceView />} />
      <Route path="fees" element={<FeesHistory />} />
      <Route path="exams" element={<MyExams />} />
      <Route path="results" element={<MyResults />} />
      <Route path="leave" element={<ApplyLeave />} />
      <Route path="certificate" element={<RequestCertificate />} />
      <Route path="notifications" element={<Notifications />} />
    </Routes>
  );
};

export default StudentRoutes;

