// src/modules/admin/pages/ExamCreate.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExamCreate = () => {
  const { id } = useParams(); // if id exists → edit mode
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    examTitle: '',
    description: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: '',
    instructions: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchExam();
    }
  }, [id]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/exams/${id}`);
      const exam = res.data.data;
      setFormData({
        examTitle: exam.examTitle || '',
        description: exam.description || '',
        duration: exam.duration || 60,
        totalMarks: exam.totalMarks || 100,
        passingMarks: exam.passingMarks || '',
        instructions: exam.instructions || '',
        startDate: exam.startDate ? exam.startDate.split('T')[0] : '',
        endDate: exam.endDate ? exam.endDate.split('T')[0] : '',
      });
    } catch (err) {
      toast.error('Failed to load exam details');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`/api/exams/${id}`, formData);
        toast.success('Exam updated successfully');
      } else {
        await axios.post('/api/exams', formData);
        toast.success('Exam created successfully');
      }
      navigate('/admin/exams');
    } catch (err) {
      const message = err.response?.data?.message || 'Operation failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl">Loading exam details...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Exam' : 'Create New Exam'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? 'Update the details of the existing exam' : 'Set up a new exam for students'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-10 space-y-8">
        {/* Exam Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Exam Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.examTitle}
            onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g., Mathematics Mid-Term Exam"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description about the exam..."
          />
        </div>

        {/* Duration & Total Marks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Passing Marks */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Passing Marks (optional)
          </label>
          <input
            type="number"
            min="0"
            value={formData.passingMarks}
            onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value ? Number(e.target.value) : '' })}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Default: 40% → ${Math.ceil(formData.totalMarks * 0.4)} marks`}
          />
          <p className="text-sm text-gray-500 mt-2">
            Leave empty to use default 40% of total marks.
          </p>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructions (optional)
          </label>
          <textarea
            rows="6"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write exam instructions that students will see before starting..."
          />
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date (optional)
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date (optional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          If dates are set, the exam will only be available to students between the start and end date.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/exams')}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {isEdit ? 'Update Exam' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamCreate;