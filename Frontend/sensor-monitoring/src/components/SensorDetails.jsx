import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const SensorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulated Sensor Data (Replace with API call in real implementation)
  const sensorData = {
    "SEN-001": {
      id: "SEN-001",
      type: "input",
      location: "Loading Dock A",
      status: "active",
      installationDate: "2024-02-15",
      lastMaintenance: "2024-03-01",
      data: {
        totalScanned: "12,345",
        discardedItems: "234",
        processingRate: "85%",
        itemsProcessed: "12,000",
        processedWithError: "45",
        hourlyProcessed: "512",
      },
    },
    "SEN-002": {
      id: "SEN-002",
      type: "weighing",
      location: "Processing Area",
      status: "inactive",
      installationDate: "2023-12-10",
      lastMaintenance: "2024-02-20",
      data: {
        currentWeight: "2,345 kg",
        capacity: "5,000 kg",
        avgLoad: "78%",
        weightFullVehicle: "4,800 kg",
        weightEmptyVehicle: "1,600 kg",
        discardedWeightKg: "120 kg",
      },
    },
    "SEN-003": {
      id: "SEN-003",
      type: "output",
      location: "Packing Area",
      status: "active",
      installationDate: "2024-01-20",
      lastMaintenance: "2024-03-05",
      data: {
        itemsByCategory: { A: 500, B: 300, C: 150, D: 50 },
        totalOutput: "1000",
      },
    },
  };

  const sensor = sensorData[id];

  if (!sensor) {
    return <p className="text-red-500">Error: Sensor not found!</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
      >
        ← Back to Sensors
      </button>

      {/* Sensor Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{sensor.id}</h1>
          <p className="text-gray-600">{sensor.location}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {sensor.type} sensor
        </span>
      </div>

      {/* Sensor Type Specific Data */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sensor.type === "input" && (
          <>
            <MetricCard
              title="Total Scanned"
              value={sensor.data.totalScanned}
            />
            <MetricCard
              title="Discarded Items"
              value={sensor.data.discardedItems}
            />
            <MetricCard
              title="Processing Rate"
              value={sensor.data.processingRate}
            />
          </>
        )}
        {sensor.type === "weighing" && (
          <>
            <MetricCard
              title="Current Weight"
              value={sensor.data.currentWeight}
            />
            <MetricCard title="Capacity" value={sensor.data.capacity} />
            <MetricCard title="Avg. Load" value={sensor.data.avgLoad} />
          </>
        )}
        {sensor.type === "output" && (
          <>
            {Object.entries(sensor.data.itemsByCategory).map(
              ([category, value]) => (
                <MetricCard
                  key={category}
                  title={`Category ${category}`}
                  value={`${value} items`}
                />
              )
            )}
          </>
        )}
      </div>

      {/* Expand Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          {isExpanded ? "Hide Details" : "Expand Details"}
        </button>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3">
            Additional Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {sensor.type === "input" && (
              <>
                <MetricCard
                  title="Items Processed"
                  value={sensor.data.itemsProcessed}
                />
                <MetricCard
                  title="Processed with Error"
                  value={sensor.data.processedWithError}
                />
                <MetricCard
                  title="Hourly Processed"
                  value={sensor.data.hourlyProcessed}
                />
              </>
            )}
            {sensor.type === "weighing" && (
              <>
                <MetricCard
                  title="Full Vehicle Weight"
                  value={sensor.data.weightFullVehicle}
                />
                <MetricCard
                  title="Empty Vehicle Weight"
                  value={sensor.data.weightEmptyVehicle}
                />
                <MetricCard
                  title="Discarded Weight"
                  value={sensor.data.discardedWeightKg}
                />
              </>
            )}
            {sensor.type === "output" && (
              <>
                <MetricCard
                  title="Total Output"
                  value={sensor.data.totalOutput}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Additional Info & Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Info */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3">Maintenance Info</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Installation Date</dt>
              <dd className="text-gray-800">{sensor.installationDate}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Last Maintenance</dt>
              <dd className="text-gray-800">{sensor.lastMaintenance}</dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3">Actions</h3>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Run Diagnostics
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              Maintenance History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Metric Card Component
const MetricCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default SensorDetails;
