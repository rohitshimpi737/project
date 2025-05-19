import { useEffect, useState } from "react";
import { Outlet, NavLink, useParams } from "react-router-dom";
import plantApi from "../../api/plantApi"; // Adjust path as needed

// https://chatgpt.com/c/6825c5e7-fee0-800d-b652-a43b321a5f2d

const tabs = [
  { label: "Overview", to: "" },
  { label: "Sensors", to: "sensors" },
  { label: "Energy", to: "energy" },
  { label: "Data", to: "data" },
  { label: "Reports", to: "reports" },
];

const PlantDetailLayout = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await plantApi.getById(id);
        setPlant(res.data);
      } catch (error) {
        console.error("Failed to fetch plant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {loading ? (
        <p className="text-gray-500">Loading plant details...</p>
      ) : plant ? (
        <>
          <h1 className="text-3xl font-bold mb-1">{plant.name}</h1>
          <p className="text-gray-600 mb-4">Location: {plant.location}</p>
        </>
      ) : (
        <p className="text-red-500">Plant not found.</p>
      )}

      <div className="flex space-x-4 mb-6 border-b">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              `pb-2 border-b-2 text-sm font-medium ${
                isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-500"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default PlantDetailLayout;
