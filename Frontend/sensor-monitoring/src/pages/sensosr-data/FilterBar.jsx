import { useEffect, useState } from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import sensorApi from "../../api/sensorApi";
import plantApi from "../../api/plantApi";
import DatePicker from "./DatePicker";

const FilterBar = ({ filters, onFilterChange }) => {
  const [plants, setPlants] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [allSensors, setAllSensors] = useState([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantsRes, sensorsRes] = await Promise.all([
          plantApi.getAll(),
          sensorApi.getAll()
        ]);
        setPlants(plantsRes.data);
        setAllSensors(sensorsRes.data);
        setSensors(sensorsRes.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!filters.plant) {
      setSensors(allSensors);
    } else {
      const filtered = allSensors.filter((s) => s.plant === Number(filters.plant));
      setSensors(filtered);
    }
  }, [filters.plant, allSensors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = name === "plant" || name === "sensor" ? (value === "" ? "" : parseInt(value)) : value;

    if (type === "checkbox") {
      onFilterChange({
        ...filters,
        categories: {
          ...filters.categories,
          [name]: checked,
        },
      });
    } else {
      onFilterChange({ ...filters, [name]: val });
    }
  };

  const handleShortcut = (type) => {
    const today = new Date();
    let start, end = today.toISOString().split("T")[0];

    if (type === "today") {
      start = end;
    } else if (type === "week") {
      const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + 1);
      start = monday.toISOString().split("T")[0];
    } else if (type === "month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      start = firstDay.toISOString().split("T")[0];
    }

    onFilterChange({ ...filters, start_date: start, end_date: end });
  };

  const clearDateFilter = () => {
    onFilterChange({ ...filters, start_date: "", end_date: "" });
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="plant" className="block text-sm font-medium text-gray-700 mb-1">
            Plant
          </label>
          <select
            id="plant"
            name="plant"
            value={filters.plant || ""}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Plants</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sensor" className="block text-sm font-medium text-gray-700 mb-1">
            Sensor
          </label>
          <select
            id="sensor"
            name="sensor"
            value={filters.sensor || ""}
            onChange={handleChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Sensors</option>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
            Item
          </label>
          <input
            type="text"
            id="item"
            name="item"
            value={filters.item || ""}
            onChange={handleChange}
            placeholder="Filter by item"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDatePickerOpen(!datePickerOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <span className="flex items-center">
                <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                {filters.start_date && filters.end_date
                  ? `${filters.start_date} to ${filters.end_date}`
                  : "Select date range"}
              </span>
              {filters.start_date && filters.end_date && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDateFilter();
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </button>
            {datePickerOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-2 border border-gray-200">
                <DatePicker
                  startDate={filters.start_date}
                  endDate={filters.end_date}
                  onChange={(start, end) => {
                    onFilterChange({ ...filters, start_date: start, end_date: end });
                    setDatePickerOpen(false);
                  }}
                  onCancel={() => setDatePickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <fieldset className="space-y-2">
            <legend className="sr-only">Categories</legend>
            <div className="flex items-center space-x-4">
              {['A', 'B', 'C', 'D'].map((cat) => (
                <div key={cat} className="flex items-center">
                  <input
                    id={`category-${cat}`}
                    name={cat}
                    type="checkbox"
                    checked={filters.categories?.[cat] || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`category-${cat}`} className="ml-2 text-sm text-gray-700">
                    Category {cat}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="ml-auto flex space-x-2">
          <button
            type="button"
            onClick={() => handleShortcut("today")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleShortcut("week")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => handleShortcut("month")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            This Month
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;