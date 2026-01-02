import { useEffect, useState } from 'react';
import { getFees, getFeesHistory } from '../../../services/student.service';
import toast from 'react-hot-toast';
import { 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  Download, 
  Calendar,
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  Filter,
  Search
} from 'lucide-react';

const FeesHistory = () => {
  const [feesSummary, setFeesSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');

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

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === 'all' || item.paymentMode?.toLowerCase() === filterMode.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getPaymentModeIcon = (mode) => {
    switch(mode?.toLowerCase()) {
      case 'cash': return '💵';
      case 'online': return '💳';
      case 'cheque': return '📝';
      case 'upi': return '📱';
      default: return '💰';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <Wallet className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading fees data...</p>
      </div>
    );
  }

  const percentagePaid = feesSummary?.totalFees 
    ? ((feesSummary.paidAmount / feesSummary.totalFees) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fees Management
            </h1>
            <p className="text-slate-600 mt-2">Track your payments and balance</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105">
            <Download className="w-5 h-5" />
            <span className="font-medium">Download Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {feesSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Fees Card */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                  Total
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-1">Total Fees</p>
              <p className="text-3xl font-bold text-slate-800">
                ₹{feesSummary.totalFees?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Paid Amount Card */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                  {percentagePaid}%
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-1">Paid Amount</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{feesSummary.paidAmount?.toLocaleString() || 0}
              </p>
              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${percentagePaid}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-1">Balance Due</p>
              <p className="text-3xl font-bold text-red-600">
                ₹{feesSummary.balanceFees?.toLocaleString() || 0}
              </p>
              {feesSummary.balanceFees > 0 && (
                <button className="mt-4 w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment History Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with Search and Filter */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                <Receipt className="w-6 h-6 text-indigo-600" />
                <span>Payment History</span>
              </h2>
              <p className="text-sm text-slate-600 mt-1">{history.length} total transactions</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search receipt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white"
                >
                  <option value="all">All Modes</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No payment history found</p>
            <p className="text-sm text-slate-400 mt-1">Your transactions will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Receipt No</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Payment Mode</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((installment, index) => (
                  <tr 
                    key={installment._id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{getPaymentModeIcon(installment.paymentMode)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{installment.receiptNo}</p>
                          <p className="text-xs text-slate-500">Transaction #{index + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(installment.paidDate).toLocaleDateString('en-IN', { 
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-bold text-slate-800">
                        ₹{installment.paidAmount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        <CreditCard className="w-3 h-3" />
                        <span>{installment.paymentMode}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </td>
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