import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sensorApi from "../../api/sensorApi";
import plantApi from "../../api/plantApi";

const SensorEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // sensor id from route param

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [locationType, setLocationType] = useState("");
  const [plantId, setPlantId] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSensor, setLoadingSensor] = useState(true);
  const [installedAt, setInstalledAt] = useState("");
  const [lastMaintenance, setLastMaintenance] = useState("");

  const LOCATION_CHOICES = [
    { value: "input", label: "Input" },
    { value: "conveyer_belt", label: "Conveyer Belt" },
    { value: "weighing_machine", label: "Weighing Machine" },
    { value: "output_conveyer", label: "Output Conveyer" },
    { value: "output_weighing", label: "Output Weighing" },
  ];

  useEffect(() => {
    // Fetch plants list
    const fetchPlants = async () => {
      try {
        const response = await plantApi.getAll();
        setPlants(response.data);
      } catch (error) {
        alert("Failed to load plants list.");
      }
    };

    fetchPlants();
  }, []);

  useEffect(() => {
    // Fetch sensor data by ID
    const fetchSensor = async () => {
      try {
        setLoadingSensor(true);
        const response = await sensorApi.getById(id);
        const sensor = response.data;
        setName(sensor.name);
        setIsActive(sensor.is_active);
        setLocationType(sensor.location_type);
        setPlantId(sensor.plant);
        // Convert ISO datetime to local datetime input format
        setInstalledAt(sensor.installed_at ? sensor.installed_at.substring(0, 16) : "");
        setLastMaintenance(sensor.last_maintenance ? sensor.last_maintenance.substring(0, 16) : "");
      } catch (error) {
        alert("Failed to load sensor data.");
        navigate("/dashboard/sensors/all");
      } finally {
        setLoadingSensor(false);
      }
    };

    if (id) fetchSensor();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !locationType.trim() || !plantId) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await sensorApi.update(id, {
        name,
        is_active: isActive,
        location_type: locationType,
        plant: plantId,
        installed_at: installedAt ? new Date(installedAt).toISOString() : null,
        last_maintenance: lastMaintenance ? new Date(lastMaintenance).toISOString() : null,
      });
      alert("Sensor updated successfully!");
      navigate("/dashboard/sensors/all");
    } catch (error) {
      console.error("Failed to update sensor", error);
      alert("Failed to update sensor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/sensors/all");
  };

  if (loadingSensor) {
    return <div className="text-center py-10">Loading sensor data...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Sensor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Sensor Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter sensor name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={isActive ? "active" : "inactive"}
            onChange={(e) => setIsActive(e.target.value === "active")}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Location Type</label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="" disabled>
              Select location
            </option>
            {LOCATION_CHOICES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Attach to Plant</label>
          <select
            value={plantId}
            onChange={(e) => setPlantId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Installed At</label>
          <input
            type="datetime-local"
            value={installedAt}
            onChange={(e) => setInstalledAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last Maintenance</label>
          <input
            type="datetime-local"
            value={lastMaintenance}
            onChange={(e) => setLastMaintenance(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Sensor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SensorEdit;
