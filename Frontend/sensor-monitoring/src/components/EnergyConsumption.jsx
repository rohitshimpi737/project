import { useState } from "react";
import { Link ,useNavigate } from "react-router-dom";
import EnergyChart from "../components/EnergyChart";

const EnergyConsumption = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
      >
        ← Back to Dashboard
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Energy Consumption</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAnalytics(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View Analytics
          </button>
          <Link
            to="/dashboard/energy-analysis"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Detailed Analysis
          </Link>
        </div>
      </div>
      {/* Energy Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Energy Received</h3>
          <p className="text-2xl font-bold">45,230 kWh</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Conveyor Belt Usage</h3>
          <p className="text-2xl font-bold">12,500 kWh</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">Shredding & Processing</h3>
          <p className="text-2xl font-bold">20,100 kWh</p>
        </div>
      </div>
      {/* Energy Chart */}
      <EnergyChart />
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Energy Analytics</h3>
            <EnergyChart detailedView={true} />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowAnalytics(false)}
                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <Link
                to="/energy-analysis"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Full Analysis →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyConsumption;
