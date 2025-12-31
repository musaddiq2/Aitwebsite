import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get('/api/exams');
      setExams(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this exam? All questions and results will be lost.')) return;
    try {
      await axios.delete(`/api/exams/${id}`);
      toast.success('Exam deleted successfully');
      fetchExams();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading exams...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Exams</h1>
        <Link
          to="/admin/exams/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition"
        >
          + Create New Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-2xl text-gray-600 mb-4">No exams created yet</p>
          <p className="text-gray-500">Start by creating your first exam using the button above.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{exam.examTitle}</h2>
              
              {exam.description && (
                <p className="text-gray-600 mb-6">{exam.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-700 mb-8">
                <p><strong>Duration:</strong> {exam.duration} minutes</p>
                <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                <p><strong>Passing Marks:</strong> {exam.passingMarks} ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)</p>
                <p><strong>Questions:</strong> {exam.totalQuestions ?? '0'}</p>
                <p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    exam.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/admin/exams/questions/${exam._id}`}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Manage Questions
                </Link>
                <Link
                  to={`/admin/exams/edit/${exam._id}`}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exams;