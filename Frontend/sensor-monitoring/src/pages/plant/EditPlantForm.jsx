import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import plantApi from "../../api/plantApi";

const EditPlantForm = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    plant_type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load existing data
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const { data } = await plantApi.getById(id);
        setFormData(data);
      } catch (err) {
        setError("Failed to fetch plant data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await plantApi.update(id, formData);
      alert("Plant updated successfully!");
      navigate("/dashboard/plants");
    } catch (err) {
      console.error(err);
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Plant</h2>
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
            placeholder="Plant name"
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
            placeholder="Location"
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
          {loading ? "Updating..." : "Update Plant"}
        </button>
      </form>
    </div>
  );
};

export default EditPlantForm;
