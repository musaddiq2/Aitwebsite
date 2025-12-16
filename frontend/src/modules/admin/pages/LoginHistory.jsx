// frontend/src/modules/admin/pages/LoginHistory.jsx

import { useState, useEffect } from "react";
import {
  getLoginHistory,
  getLoginStats,
} from "../../../services/admin.service";

import {
  FaCheck,
  FaTimes,
  FaDownload,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const AdminLoginHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    userId: "",
  });

  // Fetch history + stats
  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [pagination.page]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchHistory();
  }, [filters]);

  // ==============================
  // Fetch Login History
  // ==============================
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await getLoginHistory(params);

      setHistory(response.data.history);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch login history");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Fetch Stats
  // ==============================
  const fetchStats = async () => {
    try {
      const response = await getLoginStats();
      setStats(response.data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      userId: "",
    });
  };

  // Format date string to readable format
  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Date/Time",
      "Email",
      "Name",
      "Role",
      "Status",
    
    ];

    const rows = history.map((item) => [
      formatDate(item.loginTime),
      item.email || "N/A",
      item.userId
        ? `${item.userId.firstName} ${item.userId.lastName}`
        : "N/A",
      item.userId?.role || "N/A",
      item.status,
    
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((c) => `"${c}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `login-history-${Date.now()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">

      {/* ==============================
          Stats Cards
      =============================== */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Logins</p>
                <p className="text-3xl font-bold mt-2">{stats.totalLogins}</p>
                <p className="text-blue-100 text-xs mt-1">Last 30 days</p>
              </div>
              <FaChartLine className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Success</p>
                <p className="text-3xl font-bold mt-2">{stats.successfulLogins}</p>
                <p className="text-green-100 text-xs mt-1">{stats.successRate}% rate</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Failed</p>
                <p className="text-3xl font-bold mt-2">{stats.failedLogins}</p>
                <p className="text-red-100 text-xs mt-1">Failed attempts</p>
              </div>
              <FaTimesCircle className="text-4xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Unique Users</p>
                <p className="text-3xl font-bold mt-2">{stats.uniqueUsers}</p>
                <p className="text-purple-100 text-xs mt-1">Active users</p>
              </div>
              <FaUsers className="text-4xl text-purple-200" />
            </div>
          </div>

        </div>
      )}

      {/* ==============================
          Table Card
      =============================== */}
      <div className="bg-white rounded-lg shadow-md">

        <div className="px-6 py-4 border-b flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">Login History</h2>
            <p className="text-gray-600">Monitor user login activities</p>
          </div>

          <button
            onClick={exportToCSV}
            disabled={!history.length}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaDownload />
            Export CSV
          </button>

        </div>

        {/* Filters */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>

        </div>

        {/* Loading / Error / Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="px-6 py-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>                   
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        No login history found
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(item.loginTime)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.userId
                              ? `${item.userId.firstName} ${item.userId.lastName}`
                              : "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">{item.email || "N/A"}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.userId?.role || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status === "Success" ? (
                            <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <FaCheck className="mr-1" /> Success
                            </span>
                          ) : (
                            <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <FaTimes className="mr-1" /> Failed
                            </span>
                          )}
                        </td>
                       

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">

                <div className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total entries)
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {pagination.page}
                  </span>

                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>

              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
};

export default AdminLoginHistory;