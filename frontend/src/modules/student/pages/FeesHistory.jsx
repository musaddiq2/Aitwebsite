import { useEffect, useState } from 'react';
import { getFees, getFeesHistory } from '../../../services/student.service';
import toast from 'react-hot-toast';

const FeesHistory = () => {
  const [feesSummary, setFeesSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeesData();
  }, []);

  const fetchFeesData = async () => {
    try {
      setLoading(true);
      const [summaryRes, historyRes] = await Promise.all([
        getFees(),
        getFeesHistory()
      ]);

      if (summaryRes.success) {
        setFeesSummary(summaryRes.data);
      }
      if (historyRes.success) {
        setHistory(historyRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load fees data');
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
      <h1 className="text-3xl font-bold mb-6">Fees History</h1>

      {feesSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Fees</p>
            <p className="text-2xl font-bold">₹{feesSummary.totalFees?.toLocaleString() || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{feesSummary.paidAmount?.toLocaleString() || 0}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Balance</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{feesSummary.balanceFees?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No payment history found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Receipt No</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Mode</th>
                </tr>
              </thead>
              <tbody>
                {history.map((installment) => (
                  <tr key={installment._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{installment.receiptNo}</td>
                    <td className="p-4">
                      {new Date(installment.paidDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">₹{installment.paidAmount?.toLocaleString()}</td>
                    <td className="p-4">{installment.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesHistory;

