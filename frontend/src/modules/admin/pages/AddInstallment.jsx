import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStudents,
  createInstallment
} from '../../../services/admin.service';

const AddInstallment = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    paidAmount: '',
    paidDate: '',
    paymentMode: 'Cash'
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    getStudents().then(res => {
      setStudents(res.data || res);
    });
  }, []);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setForm({ ...form, studentId });

    const student = students.find(s => s._id === studentId);
    setSelectedStudent(student);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createInstallment({
        ...form,
        paidAmount: Number(form.paidAmount),
      });

      navigate('/admin/fees/installments');
    } catch (error) {
      alert('Failed to add installment');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Installment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Student */}
        <select
          required
          className="w-full border p-2 rounded"
          onChange={handleStudentChange}
        >
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        {/* Total Fees */}
        {selectedStudent && (
          <div className="bg-gray-100 p-3 rounded">
            <p>Total Fees: ₹{selectedStudent.fullCourseFees}</p>
            <p>Paid: ₹{selectedStudent.feesPaidAmount || 0}</p>
            <p className="font-bold">
              Pending: ₹
              {selectedStudent.fullCourseFees -
                (selectedStudent.feesPaidAmount || 0)}
            </p>
          </div>
        )}

        {/* Paid Amount */}
        <input
          type="number"
          placeholder="Paid Amount"
          className="w-full border p-2 rounded"
          required
          value={form.paidAmount}
          onChange={e =>
            setForm({ ...form, paidAmount: e.target.value })
          }
        />

        {/* Paid Date */}
        <input
          type="date"
          className="w-full border p-2 rounded"
          required
          value={form.paidDate}
          onChange={e =>
            setForm({ ...form, paidDate: e.target.value })
          }
        />

        {/* Payment Mode */}
        <select
          className="w-full border p-2 rounded"
          value={form.paymentMode}
          onChange={e =>
            setForm({ ...form, paymentMode: e.target.value })
          }
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Online</option>
          <option>Cheque</option>
        </select>

        <button
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Save Installment
        </button>
      </form>
    </div>
  );
};

export default AddInstallment;
