import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";
import plantApi from "../../api/plantApi";

const PlantTable = () => {

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
    setLoading(true);
      try {
        const response = await plantApi.getAll();
        setPlants(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch plants.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);



  // Handlers for Edit and Delete actions
  const handleEdit = (id) => {
    alert(`Edit plant with ID ${id}`);
    navigate(`/dashboard/plant/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const plant = plants.find((p) => p.id === id);
    if (window.confirm(`Are you sure you want to delete plant: ${plant.name}?`)) {
      try {
        await plantApi.delete(id);
        setPlants((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete plant.");
      }
    }
  };

  const handleAddNew = () => {
    alert("Redirect to add new plant page");
    navigate("/dashboard/plants/add");
  };

  const handleView = (id) => {
  navigate(`/dashboard/plant/${id}`);
};

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Plant Inventory</h1>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={handleAddNew}
          aria-label="Add New Plant"
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
          Add New Plant
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Plant Type
              </th>


              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>


            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {plants.length > 0 ? (
              plants.map((plant) => (
                <tr key={plant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {plant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{plant.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">
                    {plant.plant_type}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-between items-center">
                      <button
                        title="Edit"
                        onClick={() => handleEdit(plant.id)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit"
    
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(plant.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        title="View Details"
                        onClick={() => handleView(plant.id)}
                        className="text-green-600 hover:text-green-800"
                        aria-label="View Details"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>
                  </td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                  No plants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantTable;
