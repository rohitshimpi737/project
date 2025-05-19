import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sensorApi from "../../api/sensorApi";
import plantApi from "../../api/plantApi";  // Assuming this exists

const SensorAdd = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [locationType, setLocationType] = useState("");
    const [plantId, setPlantId] = useState(""); // To store selected plant ID
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [plantsLoading, setPlantsLoading] = useState(true);
    const [installedAt, setInstalledAt] = useState("");
    const [lastMaintenance, setLastMaintenance] = useState("");

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const response = await plantApi.getAll();
                setPlants(response.data);
                if (response.data.length > 0) setPlantId(response.data[0].id); // default select first plant
            } catch (error) {
                console.error("Failed to fetch plants", error);
                alert("Failed to load plants list.");
            } finally {
                setPlantsLoading(false);
            }
        };

        fetchPlants();
    }, []);

    const LOCATION_CHOICES = [
        { value: "input", label: "Input" },
        { value: "conveyer_belt", label: "Conveyer Belt" },
        { value: "weighing_machine", label: "Weighing Machine" },
        { value: "output_conveyer", label: "Output Conveyer" },
        { value: "output_weighing", label: "Output Weighing" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !locationType.trim() || !plantId) {
            alert("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await sensorApi.create({
                name,
                is_active: isActive,
                location_type: locationType,
                plant: plantId, 
                installed_at: installedAt ? new Date(installedAt).toISOString() : null,
                last_maintenance: lastMaintenance ? new Date(lastMaintenance).toISOString() : null,
            });

            alert("Sensor added successfully!");
            navigate("/dashboard/sensors/all");
        } catch (error) {
            console.error("Failed to add sensor", error);
            alert("Failed to add sensor. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/sensors/all");
    };

    if (plantsLoading) {
        return (
            <div className="text-center py-10">
                Loading plants...
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Sensor</h2>
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
                        {loading ? "Saving..." : "Add Sensor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SensorAdd;
