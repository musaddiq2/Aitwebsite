import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as adminService from '../../../services/admin.service';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, [filter, currentPage]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await adminService.getCertificates(params);
      setCertificates(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailModal(true);
  };

  const openActionModal = (certificate, type) => {
    setSelectedCertificate(certificate);
    setModalType(type);
    setShowActionModal(true);
    setRemarks('');
    setCertificateUrl('');
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowActionModal(false);
    setSelectedCertificate(null);
    setModalType('');
    setRemarks('');
    setCertificateUrl('');
  };

  const handleApprove = async () => {
    try {
      setActionLoading(selectedCertificate._id);
      await adminService.approveCertificate(selectedCertificate._id, { 
        certificateUrl: certificateUrl || null 
      });
      toast.success('Certificate approved successfully');
      closeModals();
      fetchCertificates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve certificate');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Please provide rejection remarks');
      return;
    }

    try {
      setActionLoading(selectedCertificate._id);
      await adminService.rejectCertificate(selectedCertificate._id, { remarks });
      toast.success('Certificate rejected successfully');
      closeModals();
      fetchCertificates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject certificate');
    } finally {
      setActionLoading(null);
    }
  };

  const handleIssue = async () => {
    if (!certificateUrl.trim()) {
      toast.error('Please provide certificate URL');
      return;
    }

    try {
      setActionLoading(selectedCertificate._id);
      await adminService.issueCertificate(selectedCertificate._id, { certificateUrl });
      toast.success('Certificate issued successfully');
      closeModals();
      fetchCertificates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Issued: 'bg-blue-100 text-blue-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
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
        <h1 className="text-3xl font-bold mb-2">Certificate Management</h1>
        <p className="text-gray-600">Review and manage student certificate requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {['all', 'Pending', 'Approved', 'Issued', 'Rejected'].map((status) => (
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

      {/* Certificate Cards */}
      {certificates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No certificate requests found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {certificates.map((cert) => (
              <div key={cert._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {cert.studentFullName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Certificate No: <span className="font-medium">{cert.certificateNumber}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(cert.status)}`}>
                    {cert.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{cert.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="font-medium text-gray-900">{cert.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium text-gray-900">{cert.contactNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request Date</p>
                    <p className="font-medium text-gray-900">{formatDate(cert.requestDate)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => openDetailModal(cert)}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                  >
                    View Full Details
                  </button>

                  {cert.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openActionModal(cert, 'approve')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openActionModal(cert, 'reject')}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {cert.status === 'Approved' && (
                    <button
                      onClick={() => openActionModal(cert, 'issue')}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Issue Certificate
                    </button>
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
                className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Certificate Details</h2>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedCertificate.status)}`}>
                  {selectedCertificate.status}
                </span>
              </div>

              {/* Student Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedCertificate.studentFullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedCertificate.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact No</p>
                    <p className="font-medium">{selectedCertificate.contactNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{formatDate(selectedCertificate.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mother's Name</p>
                    <p className="font-medium">{selectedCertificate.mothersName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-medium">{selectedCertificate.qualification || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Course & Fee Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Course & Fee Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Course Name</p>
                    <p className="font-medium">{selectedCertificate.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certificate Number</p>
                    <p className="font-medium">{selectedCertificate.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Paid Amount</p>
                    <p className="font-medium">₹{selectedCertificate.paidAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Fees</p>
                    <p className="font-medium">₹{selectedCertificate.totalFees}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedCertificate.remark && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Remarks</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedCertificate.remark}</p>
                </div>
              )}

              {/* Documents */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedCertificate.studentSign && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Signature</p>
                      <img 
                        src={selectedCertificate.studentSign} 
                        alt="Signature" 
                        className="border rounded p-2 h-24 object-contain bg-gray-50"
                      />
                    </div>
                  )}
                  {selectedCertificate.studentPhoto && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Photo</p>
                      <img 
                        src={selectedCertificate.studentPhoto} 
                        alt="Photo" 
                        className="border rounded p-2 h-32 object-cover bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Information */}
              {selectedCertificate.certificateUrl && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Certificate</h3>
                  <a 
                    href={selectedCertificate.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Certificate
                  </a>
                </div>
              )}

              {/* Admin Remarks */}
              {selectedCertificate.remarks && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Admin Remarks</h3>
                  <p className="text-red-700 bg-red-50 p-3 rounded">{selectedCertificate.remarks}</p>
                </div>
              )}

              {/* Dates */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Request Date:</span> <span className="font-medium">{formatDate(selectedCertificate.requestDate)}</span></p>
                  {selectedCertificate.approvedDate && (
                    <p><span className="text-gray-600">Approved Date:</span> <span className="font-medium">{formatDate(selectedCertificate.approvedDate)}</span></p>
                  )}
                  {selectedCertificate.issueDate && (
                    <p><span className="text-gray-600">Issue Date:</span> <span className="font-medium">{formatDate(selectedCertificate.issueDate)}</span></p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModals}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'approve' && 'Approve Certificate'}
              {modalType === 'reject' && 'Reject Certificate'}
              {modalType === 'issue' && 'Issue Certificate'}
            </h2>

            {(modalType === 'approve' || modalType === 'issue') && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Certificate URL {modalType === 'issue' && '*'}
                </label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://example.com/certificate.pdf"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}

            {modalType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Rejection Remarks *
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full p-3 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModals}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={
                  modalType === 'approve' ? handleApprove :
                  modalType === 'reject' ? handleReject :
                  handleIssue
                }
                disabled={
                  actionLoading ||
                  (modalType === 'reject' && !remarks.trim()) ||
                  (modalType === 'issue' && !certificateUrl.trim())
                }
                className={`px-4 py-2 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  modalType === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                  modalType === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {modalType === 'approve' && 'Approve'}
                    {modalType === 'reject' && 'Reject'}
                    {modalType === 'issue' && 'Issue'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;