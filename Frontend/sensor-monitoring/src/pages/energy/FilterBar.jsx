import { useEffect, useState } from "react";
import { FiCalendar, FiX, FiDownload } from "react-icons/fi";
import sensorApi from "../../api/sensorApi";
import plantApi from "../../api/plantApi";
import DatePicker from "../sensosr-data/DatePicker";

const FilterBar = ({ filters, onFilterChange, onExport }) => {
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
    const { name, value } = e.target;
    const val = name === "plant" || name === "sensor" ? (value === "" ? "" : parseInt(value)) : value;
    onFilterChange({ ...filters, [name]: val });
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

    onFilterChange({ ...filters, start_date: start, end_date: end, date_filter: type });
  };

  const clearDateFilter = () => {
    onFilterChange({ ...filters, start_date: "", end_date: "", date_filter: "" });
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Plant Dropdown */}
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

        {/* Sensor Dropdown */}
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

        {/* Date Range */}
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
                    onFilterChange({ ...filters, start_date: start, end_date: end, date_filter: "" });
                    setDatePickerOpen(false);
                  }}
                  onCancel={() => setDatePickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex items-end">
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Shortcut Buttons */}
      <div className="flex gap-2">
        {["today", "week", "month"].map((type) => (
          <button
            key={type}
            onClick={() => handleShortcut(type)}
            className={`px-3 py-1 text-xs font-medium rounded ${
              filters.date_filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type === "today"
              ? "Today"
              : type === "week"
              ? "This Week"
              : "This Month"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;