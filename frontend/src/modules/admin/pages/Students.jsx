import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent } from '../../../services/admin.service';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      
      const response = await getStudents(params);
      if (response.success) {
        setStudents(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to load students');
      console.error('Students error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const response = await deleteStudent(id);
      if (response.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
      }
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <button 
          onClick={() => navigate('/admin/students/add')}
          className="btn btn-primary"
        >
          Add Student
        </button>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>

      <div className="card">
        {students.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No students found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Roll No</th>
                  <th className="text-left p-4">Course</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{student.firstName} {student.lastName}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.rollNo || '-'}</td>
                    <td className="p-4">{student.courseName || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/admin/students/${student._id}`)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
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

export default Students;

