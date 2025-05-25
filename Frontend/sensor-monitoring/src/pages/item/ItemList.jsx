import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import itemApi from "../../api/itemApi"; // Ensure this matches your API path

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
    setLoading(true);
      try {
        const response = await itemApi.getAll(); // e.g., GET /api/items
        setItems(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/items/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id);
    if (window.confirm(`Delete item: ${item.name}?`)) {
      try {
        await itemApi.delete(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete item.");
      }
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/items/${id}`);
  };

  const handleAddNew = () => {
    navigate("/dashboard/items/add");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Item Inventory</h1>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={handleAddNew}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Item
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-700">{item.description}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleView(item.id)} className="text-green-600 hover:text-green-800">
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;
