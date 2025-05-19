import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SensorManagement = () => {
  const navigate = useNavigate();
  const [sensors] = useState([
    {
      id: "SEN-001",
      name: "Input Conveyor Scanner",
      type: "input",
      status: "active",
      lastReading: "1,234 items",
      location: "Loading Dock A",
    },
    {
      id: "SEN-002",
      name: "Weighing Machine",
      type: "weighing",
      status: "inactive",
      lastReading: "0 kg",
      location: "Processing Area",
    },
    {
      id: "SEN-003",
      name: "Temperature Sensor",
      type: "temperature",
      status: "active",
      lastReading: "24°C",
      location: "Cold Storage",
    },
    {
      id: "SEN-004",
      name: "Humidity Detector",
      type: "humidity",
      status: "active",
      lastReading: "45% RH",
      location: "Warehouse B",
    },
    {
      id: "SEN-005",
      name: "Gas Leak Sensor",
      type: "gas",
      status: "inactive",
      lastReading: "No Leak",
      location: "Maintenance Room",
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
      >
        ← Back to Dashboard
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sensor Management</h1>
        <div className="flex gap-4">
          <Link
            to="/dashboard/product-analysis"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Product Analysis
          </Link>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add New Sensor
          </button>
        </div>
      </div>
      {/* Sensor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={`p-4 rounded-lg border shadow-sm relative group transition-all ${
              sensor.status === "active"
                ? "border-green-300 bg-green-50 hover:bg-green-100"
                : "border-gray-300 bg-gray-100 opacity-75"
            }`}
          >
            {/* Inactive Overlay */}
            {sensor.status === "inactive" && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center text-sm text-gray-600">
                Sensor Inactive
              </div>
            )}

            {/* Sensor Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{sensor.name}</h3>
                <p className="text-sm text-gray-500">{sensor.id}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sensor.status === "active"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {sensor.status}
              </span>
            </div>

            {/* Sensor Details */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <p className="capitalize">{sensor.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Reading</p>
                <p>{sensor.lastReading}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Location</p>
                <p>{sensor.location}</p>
              </div>
            </div>

            {/* View Details Button */}
            {sensor.status === "active" && (
              <Link
                to={`/dashboard/sensor-management/${sensor.id}`}
                className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorManagement;
