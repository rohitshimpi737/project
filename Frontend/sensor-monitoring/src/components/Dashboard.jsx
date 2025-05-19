import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, John Doe!
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your products and track energy consumption.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/dashboard/sensor-management"
          className="p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200 hover:border-blue-400 transition"
        >
          <h3 className="text-lg font-semibold text-blue-700">
            Product Management
          </h3>
          <p className="text-sm text-blue-600">
            Manage and monitor your sensors.
          </p>
        </Link>

        <Link
          to="/dashboard/energy-consumption"
          className="p-6 bg-green-50 rounded-lg shadow-md border border-green-200 hover:border-green-400 transition"
        >
          <h3 className="text-lg font-semibold text-green-700">
            Energy Overview
          </h3>
          <p className="text-sm text-green-600">
            Analyze energy consumption trends.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
