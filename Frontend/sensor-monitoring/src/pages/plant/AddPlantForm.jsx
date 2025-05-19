import React, { useState } from "react";
import plantApi from "../../api/plantApi"; 
import { useNavigate } from "react-router-dom";

const AddPlantForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    plant_type: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await plantApi.create(formData);
      alert("Plant added successfully!");
      navigate("/dashboard/plants"); // update this to your route
    } catch (err) {
      console.error(err);
      setError("Failed to add plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Plant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-1"
            placeholder="Name of the plant"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-1"
            placeholder="Location of the plant"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Plant Type</label>
          <select
            name="plant_type"
            required
            value={formData.plant_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg mt-1"
          >
            <option value="">Select Type</option>
            <option value="recycling">Recycling</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
};

export default AddPlantForm;
