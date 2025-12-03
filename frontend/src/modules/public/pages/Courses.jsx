const Courses = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Our Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course cards will be populated from API */}
          <p className="text-gray-600">Courses will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Courses;

