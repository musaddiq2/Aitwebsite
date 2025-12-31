import { Link } from 'react-router-dom';

const Fees = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fees Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Installments */}
        <Link
          to="/admin/fees/installments"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Installments</h2>
          <p className="text-gray-600 mt-2">
            View all fee payments & balances
          </p>
        </Link>

        {/* Add Installment */}
        <Link
          to="/admin/fees/add"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Add Payment</h2>
          <p className="text-gray-600 mt-2">
            Record new installment payment
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Fees;
