
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    examId: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchExamsAndResults();
  }, []);

  const fetchExamsAndResults = async () => {
    try {
      const [examsRes, resultsRes] = await Promise.all([
        axios.get('/api/exams?limit=100'), // Get all exams for filter dropdown
        axios.get('/api/results')
      ]);

      setExams(examsRes.data.data || []);
      setResults(resultsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = results;

    if (filters.examId) {
      filtered = filtered.filter(r => r.examId._id === filters.examId);
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.studentName.toLowerCase().includes(term) ||
        r.examId.examTitle.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const handleReleaseResult = async (resultId, currentReleased) => {
    if (!confirm(`Are you sure you want to ${currentReleased ? 'unrelease' : 'release'} this result?`)) return;

    try {
      await axios.patch(`/api/results/${resultId}/release`, { isReleased: !currentReleased });
      toast.success(`Result ${currentReleased ? 'unreleased' : 'released'} successfully`);
      fetchExamsAndResults(); // Refresh
    } catch (err) {
      toast.error('Failed to update result status');
    }
  };

  const filteredResults = applyFilters();

  if (loading) return <div className="p-8 text-center">Loading results...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Exam Results</h1>
        <div className="text-sm text-gray-600">
          Total Results: <span className="font-semibold">{results.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Exam</label>
            <select
              value={filters.examId}
              onChange={(e) => setFilters({ ...filters, examId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Exams</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.examTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Search Student / Exam</label>
            <input
              type="text"
              placeholder="Enter name or exam title..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ examId: '', status: '', search: '' })}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Taken
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Released
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No results found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                        <div className="text-xs text-gray-500">Submitted: {new Date(result.examDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.examId?.examTitle || 'Unknown Exam'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {result.score} / {result.totalMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-bold ${result.percentage >= 60 ? 'text-green-600' : result.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        result.status === 'Passed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {result.isReleased ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleReleaseResult(result._id, result.isReleased)}
                        className={`px-4 py-2 rounded text-white font-medium ${
                          result.isReleased 
                            ? 'bg-orange-600 hover:bg-orange-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {result.isReleased ? 'Unrelease' : 'Release Result'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/admin/exams"
          className="text-blue-600 hover:underline"
        >
          ← Back to Exams
        </Link>
      </div>
    </div>
  );
};

export default ExamResults;