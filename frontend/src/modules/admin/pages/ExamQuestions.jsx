
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExamQuestions = () => {
  const { id: examId } = useParams(); // Exam ID from route /exams/questions/:id
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 1,
    explanation: '',
    difficulty: 'Medium'
  });

  useEffect(() => {
    fetchExamAndQuestions();
  }, [examId]);

  const fetchExamAndQuestions = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        axios.get(`/api/exams/${examId}`),
        axios.get(`/api/questions?examId=${examId}`)
      ]);

      setExam(examRes.data.data);
      setQuestions(questionsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load exam or questions');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.questionText || !formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingQuestion) {
        await axios.put(`/api/questions/${editingQuestion._id}`, { ...formData, examId });
        toast.success('Question updated successfully');
      } else {
        await axios.post('/api/questions', { ...formData, examId });
        toast.success('Question added successfully');
      }

      resetForm();
      fetchExamAndQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      marks: question.marks,
      explanation: question.explanation || '',
      difficulty: question.difficulty
    });
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Delete this question permanently?')) return;

    try {
      await axios.delete(`/api/questions/${questionId}`);
      toast.success('Question deleted');
      fetchExamAndQuestions();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 1,
      explanation: '',
      difficulty: 'Medium'
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Questions for</h1>
          <p className="text-xl text-gray-700 mt-1">{exam?.examTitle}</p>
          <p className="text-sm text-gray-500">Total Questions: {questions.length}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          + Add New Question
        </button>
      </div>

      {/* Add/Edit Question Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Question Text *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Option A *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Option B *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Option C *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Option D *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Correct Answer *</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: +e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Explanation (optional)</label>
                <textarea
                  rows="3"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                >
                  {editingQuestion ? 'Update' : 'Add'} Question
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No questions added yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              Add the first question
            </button>
          </div>
        ) : (
          questions.map((q, index) => (
            <div key={q._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-lg font-medium mb-3">
                    <span className="text-gray-500">{index + 1}.</span> {q.questionText}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <p><strong>A:</strong> {q.optionA}</p>
                    <p><strong>B:</strong> {q.optionB}</p>
                    <p><strong>C:</strong> {q.optionC}</p>
                    <p><strong>D:</strong> {q.optionD}</p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Correct: {q.correctAnswer}
                    </span>
                    <span className="mx-2">•</span>
                    Marks: {q.marks}
                    <span className="mx-2">•</span>
                    Difficulty: <span className={`font-medium ${
                      q.difficulty === 'Easy' ? 'text-green-600' :
                      q.difficulty === 'Hard' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{q.difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-6">
                  <button
                    onClick={() => handleEdit(q)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate('/admin/exams')}
        className="mt-8 text-blue-600 hover:underline"
      >
        ← Back to Exams List
      </button>
    </div>
  );
};

export default ExamQuestions;