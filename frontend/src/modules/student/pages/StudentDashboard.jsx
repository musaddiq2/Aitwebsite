import { useEffect, useState } from 'react';
import { getDashboard } from '../../../services/student.service';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Attendance</h3>
          <p className="text-2xl font-bold">
            {dashboard?.attendance?.percentage || 0}%
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {dashboard?.attendance?.present || 0} Present / {dashboard?.attendance?.total || 0} Total
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Exams</h3>
          <p className="text-2xl font-bold">
            {dashboard?.exams?.count || 0}
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Balance Fees</h3>
          <p className="text-2xl font-bold">
            ₹{dashboard?.fees?.balanceFees?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Paid: ₹{dashboard?.fees?.totalPaid || 0} / ₹{dashboard?.fees?.totalFees || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

