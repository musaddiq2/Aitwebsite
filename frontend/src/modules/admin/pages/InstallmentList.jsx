import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Using the alias you have in vite.config.js
import { getInstallments } from "@/services/admin.service"; 

const InstallmentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Calling the service
        const res = await getInstallments({ page: 1, limit: 50 }); 
        
        // Backend returns { data: [...] }
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load installments:', err);
        setError(err.message || 'Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading payments...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fee Installments</h2>
        <Link
          to="/admin/fees/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Payment
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-semibold text-gray-600">Receipt</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Student Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Amount Paid</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Remaining Balance</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-blue-600 font-medium">#{item.receiptNo}</td>
                  <td className="p-4 text-sm text-gray-700">
                    {item.studentId ? `${item.studentId.firstName} ${item.studentId.lastName}` : (item.name || 'N/A')}
                  </td>
                  <td className="p-4 text-sm font-semibold text-green-600">₹{item.paidAmount}</td>
                  <td className="p-4 text-sm text-red-500 font-medium">₹{item.balanceFees}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">No installment records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstallmentList;