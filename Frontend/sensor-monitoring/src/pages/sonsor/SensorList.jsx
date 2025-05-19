import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sensorApi from "../../api/sensorApi";
import { Loader2, Edit, Trash2, Eye } from "lucide-react";

const SensorList = () => {
  const navigate = useNavigate();
  const { filter } = useParams();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensors = async () => {
      setLoading(true);
      try {
        const response =
          filter === "active" || filter === "inactive"
            ? await sensorApi.getByStatus(filter)
            : await sensorApi.getAll();
        setSensors(response.data);
          console.log("Sensors:", sensors);
      } catch (err) {
        console.error("Failed to fetch sensors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, [filter]);

  const handleEdit = (id) => {
    alert(`Edit sensor with ID ${id}`);
    navigate(`/dashboard/sensor/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const sensor = sensors.find((s) => s.id === id);
    if (window.confirm(`Are you sure you want to delete sensor: ${sensor?.name}?`)) {
      try {
        await sensorApi.delete(id);
        setSensors((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete sensor.");
      }
    }
  };

  const handleAddNew = () => {
    navigate("/dashboard/sensor/add");
  };

  const handleView = (id) => {
    navigate(`/dashboard/sensor/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold capitalize text-gray-900">
          {filter || "All"} Sensors
        </h2>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          aria-label="Add New Sensor"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Sensor
        </button>
      </div>

      {/* Filter buttons */}
      <div className="mb-6 space-x-4">
        {["all", "active", "inactive"].map((type) => (
          <button
            key={type}
            onClick={() => navigate(`/dashboard/sensors/${type}`)}
            className={`px-4 py-2 rounded font-semibold capitalize ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sensor Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
                  Loading sensors...
                </td>
              </tr>
            ) : sensors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                  No sensors found.
                </td>
              </tr>
            ) : (
              sensors.map(({ id, name, is_active, location_type }) => {
                const statusText = is_active ? "Active" : "Inactive";
                const statusClass = is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800";

                return (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold leading-5 ${statusClass}`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {location_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-between items-center space-x-4">
                        <button
                          title="Edit"
                          onClick={() => handleEdit(id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          title="View Details"
                          onClick={() => handleView(id)}
                          className="text-green-600 hover:text-green-800"
                          aria-label="View Details"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorList;
