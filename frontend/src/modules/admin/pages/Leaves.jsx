import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as adminService from '../../../services/admin.service';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
 
  useEffect(() => {
    fetchLeaves();
  }, [filter, currentPage]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await adminService.getLeaves(params);
      setLeaves(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leaves');
      console.error('Fetch leaves error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      setActionLoading(leaveId);
      await adminService.approveLeave(leaveId);
      toast.success('Leave approved successfully');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve leave');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(selectedLeave._id);
      await adminService.rejectLeave(selectedLeave._id, { rejectionReason });
      toast.success('Leave rejected successfully');
      setShowModal(false);
      setRejectionReason('');
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject leave');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRejectionReason('');
    setSelectedLeave(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
        <p className="text-gray-600">Manage student leave requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === status
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      {leaves.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg mt-4">No leave requests found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {leaves.map((leave) => (
              <div key={leave._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {leave.studentId?.firstName} {leave.studentId?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Roll No:</span> {leave.studentId?.rollNo}
                      {' | '}
                      <span className="font-medium">Email:</span> {leave.studentId?.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Leave Type</p>
                    <p className="font-medium text-gray-900">{leave.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{formatDate(leave.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">{formatDate(leave.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Days</p>
                    <p className="font-medium text-gray-900">{leave.totalDays} day{leave.totalDays !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{leave.reason}</p>
                </div>

                {leave.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Rejection Reason</p>
                    <p className="text-red-800">{leave.rejectionReason}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Applied on: <span className="font-medium">{formatDate(leave.appliedDate)}</span>
                  </p>

                  {leave.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(leave._id)}
                        disabled={actionLoading === leave._id}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading === leave._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          'Approve'
                        )}
                      </button>
                      <button
                        onClick={() => openRejectModal(leave)}
                        disabled={actionLoading === leave._id}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {leave.status === 'Approved' && leave.approvedBy && (
                    <p className="text-sm text-green-600">
                      ✓ Approved by: <span className="font-medium">{leave.approvedBy.firstName} {leave.approvedBy.lastName}</span>
                    </p>
                  )}

                  {leave.status === 'Rejected' && leave.approvedBy && (
                    <p className="text-sm text-red-600">
                      ✗ Rejected by: <span className="font-medium">{leave.approvedBy.firstName} {leave.approvedBy.lastName}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and adjacent pages
                    return page === 1 || 
                           page === pagination.totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-gray-500">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded transition-colors ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Rejection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Reject Leave Request</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <span className="font-medium">{selectedLeave?.studentId?.firstName}'s</span> leave request:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || actionLoading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Rejecting...
                  </>
                ) : (
                  'Reject Leave'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;