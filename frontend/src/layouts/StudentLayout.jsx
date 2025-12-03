import { Outlet } from 'react-router-dom';
import StudentSidebar from '../modules/student/components/StudentSidebar';
import StudentHeader from '../modules/student/components/StudentHeader';

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

