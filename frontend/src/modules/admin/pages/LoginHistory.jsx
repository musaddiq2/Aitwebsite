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

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Date/Time",
      "Email",
      "Name",
      "Role",
      "Status",
      "IP",
      "Browser",
      "OS",
      "Device",
    ];

    const rows = history.map((item) => [
      formatDate(item.loginAt),
      item.email || "N/A",
      item.userId
        ? `${item.userId.firstName} ${item.userId.lastName}`
        : "N/A",
      item.userId?.role || "N/A",
      item.status,
      item.ipAddress || "N/A",
      item.browser || "N/A",
      item.os || "N/A",
      item.device || "N/A",
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

          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
            <p>Total Logins</p>
            <p className="text-3xl font-bold">{stats.totalLogins}</p>
            <FaChartLine className="text-4xl mt-2 opacity-70" />
          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
            <p>Success</p>
            <p className="text-3xl font-bold">{stats.successfulLogins}</p>
            <FaCheckCircle className="text-4xl mt-2 opacity-70" />
          </div>

          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
            <p>Failed</p>
            <p className="text-3xl font-bold">{stats.failedLogins}</p>
            <FaTimesCircle className="text-4xl mt-2 opacity-70" />
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg">
            <p>Unique Users</p>
            <p className="text-3xl font-bold">{stats.uniqueUsers}</p>
            <FaUsers className="text-4xl mt-2 opacity-70" />
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex gap-2 disabled:bg-gray-400"
          >
            <FaDownload />
            Export CSV
          </button>

        </div>

        {/* Filters */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg"
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
          <div className="px-6 py-4 text-red-600">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Date/Time</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">IP</th>
                    <th className="px-4 py-2">Browser/OS</th>
                    <th className="px-4 py-2">Device</th>
                  </tr>
                </thead>

                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        No login history found
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item._id} className="border-b">

                        <td className="px-4 py-2">{formatDate(item.loginAt)}</td>

                        <td className="px-4 py-2">
                          <div className="font-medium">
                            {item.userId
                              ? `${item.userId.firstName} ${item.userId.lastName}`
                              : "Unknown"}
                          </div>
                          <div className="text-gray-500">{item.email}</div>
                        </td>

                        <td className="px-4 py-2">{item.userId?.role}</td>

                        <td className="px-4 py-2">
                          {item.status === "Success" ? (
                            <span className="text-green-600 flex gap-1">
                              <FaCheck /> Success
                            </span>
                          ) : (
                            <span className="text-red-600 flex gap-1">
                              <FaTimes /> Failed
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2">{item.ipAddress}</td>

                        <td className="px-4 py-2">
                          {item.browser}
                          <div className="text-xs text-gray-400">{item.os}</div>
                        </td>

                        <td className="px-4 py-2">{item.device}</td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 flex justify-between">

                <span>
                  Page {pagination.page} / {pagination.pages}
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    className="px-3 py-1 border rounded-lg"
                  >
                    Prev
                  </button>

                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    className="px-3 py-1 border rounded-lg"
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
