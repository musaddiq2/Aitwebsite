import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as studentService from '../../../services/student.service';

const RequestCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    studentEmail: '',
    studentFullName: '',
    contactNo: '',
    dateOfBirth: '',
    mothersName: '',
    qualification: '',
    courseName: '',
    paidAmount: '',
    totalFees: '',
    remark: '',
    studentSign: null,
    studentPhoto: null
  });

  // Placeholder URLs (professional sample-style)
  const PHOTO_PLACEHOLDER = "https://media.istockphoto.com/id/176221393/photo/businessman-portrait-silhouette-and-a-mysterious-face.jpg?s=612x612&w=0&k=20&c=ptxtuyNZh5rH2TWW3NOHrlhGMZC42d13bnC5VjZG4-Q=";
  const SIGN_PLACEHOLDER = "https://onlinepngtools.com/images/examples-onlinepngtools/two-handwritten-signatures.png";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch certificate history
        const certResponse = await studentService.getCertificates();
        setCertificates(certResponse.data || []);

        // Fetch profile
        const profileResponse = await studentService.getProfile();
        const student = profileResponse.data || profileResponse;

        // Auto-fill form with correct backend field names
        setFormData(prev => ({
          ...prev,
          studentEmail: student.email || '',
          studentFullName: student.fullName || '',
          contactNo: student.phone || '',
          courseName: student.courseId?.courseName || 'N/A',
          paidAmount: student.feesPaidAmount || 0,
          totalFees: student.fullCourseFees || 0,
          dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
          mothersName: student.mothersName || '',
          qualification: student.qualification || '',
        }));

      } catch (error) {
        console.error('Load data error:', error);
        toast.error(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentEmail || !formData.studentFullName || !formData.contactNo ||
        !formData.dateOfBirth || !formData.courseName || 
        formData.paidAmount === '' || formData.totalFees === '' ||
        !formData.studentSign || !formData.studentPhoto) {
      toast.error('Please fill all required fields including signature and photo');
      return;
    }

    try {
      setSubmitting(true);
      await studentService.requestCertificate(formData);
      toast.success('Certificate request submitted successfully!');
      setShowForm(false);
      setFormData(prev => ({
        ...prev,
        remark: '',
        studentSign: null,
        studentPhoto: null
      }));

      const response = await studentService.getCertificates();
      setCertificates(response.data || []);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
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
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasPendingOrApproved = certificates.some(
    cert => cert.status === 'Pending' || cert.status === 'Approved'
  );

  const isFeesFullyPaid = Number(formData.paidAmount) >= Number(formData.totalFees);
  const pendingAmount = Number(formData.totalFees) - Number(formData.paidAmount);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Certificate Request</h1>
        <p className="text-gray-600">Request your course completion certificate</p>
      </div>

      {!showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Request New Certificate</h2>
              <p className="text-gray-600">Submit required details to get your certificate</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={hasPendingOrApproved}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Request Certificate
            </button>
          </div>
          {hasPendingOrApproved && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ You already have a pending or approved certificate request.
              </p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Certificate Request Form</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-3xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email *</label>
                <input type="email" value={formData.studentEmail} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="studentFullName" value={formData.studentFullName} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <input type="text" value={formData.courseName} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No *</label>
                <input type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹) *</label>
                <input type="number" value={formData.paidAmount} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees (₹) *</label>
                <input type="number" value={formData.totalFees} readOnly className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-lg font-semibold text-gray-800 mb-4">Fees Payment Status</p>
              <div className="flex items-center gap-10 text-lg">
                <label className="flex items-center">
                  <input type="radio" checked={isFeesFullyPaid} readOnly className="mr-3" />
                  <span className={isFeesFullyPaid ? 'text-green-700 font-bold' : 'text-gray-500'}>Yes - Fully Paid</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" checked={!isFeesFullyPaid} readOnly className="mr-3" />
                  <span className={!isFeesFullyPaid ? 'text-red-700 font-bold' : 'text-gray-500'}>
                    No - Pending ₹{pendingAmount > 0 ? pendingAmount : 0}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                <input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remark (Optional)</label>
              <textarea name="remark" value={formData.remark} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Any additional information..." />
            </div>

            {/* Simple Signature & Photo Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Student Signature - Single One Only */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Student Signature * (Clear handwritten)
    </label>
    <input
      type="file"
      name="studentSign"
      onChange={handleFileChange}
      accept="image/*"
      required={!formData.studentSign}
      className="w-full p-3 border border-gray-300 rounded-lg"
    />
    <div className="mt-4 flex justify-center bg-white p-4 rounded-lg border border-gray-300">
      <img
        src={formData.studentSign || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBkFJZsRNKI468_T7F4ivyYxMOapRHTBVUhQ&s"}
        alt="Signature Preview"
        className="h-24 object-contain"
      />
    </div>
    {!formData.studentSign && (
      <p className="text-center text-sm text-gray-500 mt-2">Upload your signature</p>
    )}
  </div>

  {/* Student Photo - Bright Color Passport Size */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Student Photo * (Passport size)
    </label>
    <input
      type="file"
      name="studentPhoto"
      onChange={handleFileChange}
      accept="image/*"
      required={!formData.studentPhoto}
      className="w-full p-3 border border-gray-300 rounded-lg"
    />
    <div className="mt-4 flex justify-center bg-white p-4 rounded-lg border border-gray-300">
      <img
        src={formData.studentPhoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwKAxj57HeCFD_sZhDAEB3ds6IXeqGRHu8A&s"}
        alt="Photo Preview"
        className="h-48 w-40 object-cover rounded-lg shadow"
      />
    </div>
    {!formData.studentPhoto && (
      <p className="text-center text-sm text-gray-500 mt-2">Upload passport size photo</p>
    )}
  </div>
</div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg disabled:opacity-60 flex items-center justify-center gap-3 transition"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Certificate Request'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certificate History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">My Certificate Requests</h2>
        {certificates.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No certificate requests found</p>
        ) : (
          <div className="space-y-5">
            {certificates.map((cert) => (
              <div key={cert._id} className="border rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{cert.courseId?.courseName || cert.courseName}</h3>
                    <p className="text-sm text-gray-600">Certificate No: {cert.certificateNumber || 'Processing...'}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(cert.status)}`}>
                    {cert.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Requested on: {formatDate(cert.requestDate || cert.createdAt)}</p>
                  {cert.issueDate && <p>Issued on: {formatDate(cert.issueDate)}</p>}
                </div>
                {cert.certificateUrl && cert.status === 'Issued' && (
                  <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Download Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCertificate;