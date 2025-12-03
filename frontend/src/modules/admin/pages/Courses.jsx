import { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../../../services/admin.service';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to load courses');
      console.error('Courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await deleteCourse(id);
      if (response.success) {
        toast.success('Course deleted successfully');
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to delete course');
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
        <h1 className="text-3xl font-bold">Courses</h1>
        <button className="btn btn-primary">Add Course</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full">
            <p className="text-gray-600 text-center py-8">No courses found</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="card">
              <h3 className="text-xl font-semibold mb-2">{course.courseName}</h3>
              <p className="text-gray-600 mb-2">Duration: {course.duration}</p>
              <p className="text-gray-600 mb-4">Fees: ₹{course.fees?.toLocaleString()}</p>
              <div className="flex space-x-2">
                <button className="btn btn-secondary text-sm">Edit</button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="btn btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;

