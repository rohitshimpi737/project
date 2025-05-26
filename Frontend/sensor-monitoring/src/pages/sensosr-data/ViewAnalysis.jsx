import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useLocation, useNavigate } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ViewAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data || [];

  const [activeMetric, setActiveMetric] = useState("production");
  const [filters, setFilters] = useState({
    plant: "",
    sensor: "",
    item: "",
    categories: { A: false, B: false, C: false, D: false },
    start_date: "",
    end_date: "",
    dateFilter: "",
  });
  const [tempFilters, setTempFilters] = useState(filters);

  const sensorNames = [...new Set(data.map((d) => d.sensor_name))];
  const sensorIds = [...new Set(data.map((d) => d.sensor_id))];
  const itemNames = [...new Set(data.map((d) => d.item))];
  const plantNames = [...new Set(data.map((d) => d.plant))];

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const matchDate = filters.dateFilter
        ? d.timestamp.startsWith(filters.dateFilter)
        : true;
      const matchStartDate = filters.start_date
        ? new Date(d.timestamp) >= new Date(filters.start_date)
        : true;
      const matchEndDate = filters.end_date
        ? new Date(d.timestamp) <= new Date(filters.end_date)
        : true;
      const matchSensor = filters.sensor ? d.sensor_id === filters.sensor : true;
      const matchPlant = filters.plant ? d.plant === filters.plant : true;
      const matchItem = filters.item ? d.item === filters.item : true;

      const categoryFilters = filters.categories;
      const anyCategoryChecked = Object.values(categoryFilters).some(Boolean);
      const matchCategory = anyCategoryChecked
        ? (categoryFilters.A && d.category_a) ||
          (categoryFilters.B && d.category_b) ||
          (categoryFilters.C && d.category_c) ||
          (categoryFilters.D && d.category_d)
        : true;

      return (
        matchDate &&
        matchStartDate &&
        matchEndDate &&
        matchSensor &&
        matchPlant &&
        matchItem &&
        matchCategory
      );
    });
  }, [data, filters]);

  const productionData = useMemo(() => {
    return filteredData.map((x) => ({
      timestamp: x.timestamp,
      Scanned: x.items_scanned,
      Processed: x.items_processed,
      Discarded: x.items_discarded,
      Errored: x.processed_with_errors,
    }));
  }, [filteredData]);

  const weightData = useMemo(() => {
    return filteredData.map((x) => ({
      timestamp: x.timestamp,
      Weight: parseFloat(x.current_weight_kg),
    }));
  }, [filteredData]);

  const qualityData = useMemo(() => {
    const totalCategoryA = filteredData.reduce((sum, x) => sum + (x.category_a || 0), 0);
    const totalCategoryB = filteredData.reduce((sum, x) => sum + (x.category_b || 0), 0);
    const totalCategoryC = filteredData.reduce((sum, x) => sum + (x.category_c || 0), 0);
    const totalCategoryD = filteredData.reduce((sum, x) => sum + (x.category_d || 0), 0);

    return [
      { name: "Category A", value: totalCategoryA },
      { name: "Category B", value: totalCategoryB },
      { name: "Category C", value: totalCategoryC },
      { name: "Category D", value: totalCategoryD },
    ];
  }, [filteredData]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-4">View Analysis</h1>

      {/* Metric Selection */}
      <div className="mb-6 space-x-4">
        {['production', 'weight', 'quality'].map((metric) => (
          <button
            key={metric}
            onClick={() => setActiveMetric(metric)}
            className={`px-4 py-2 rounded ${
              activeMetric === metric
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)} Metrics
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Date Filter:</label>
          <input
            type="date"
            value={tempFilters.dateFilter}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, dateFilter: e.target.value }))}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Start Date:</label>
          <input
            type="date"
            value={tempFilters.start_date}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, start_date: e.target.value }))}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date:</label>
          <input
            type="date"
            value={tempFilters.end_date}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, end_date: e.target.value }))}
            className="border rounded px-2 py-1"
          />
        </div>

        {/* Sensor ID */}
        <div>
          <label className="block font-medium mb-1">Sensor ID:</label>
          <select
            value={tempFilters.sensor}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, sensor: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {sensorIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        {/* Plant */}
        <div>
          <label className="block font-medium mb-1">Plant:</label>
          <select
            value={tempFilters.plant}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, plant: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {plantNames.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Item */}
        <div>
          <label className="block font-medium mb-1">Item:</label>
          <select
            value={tempFilters.item}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, item: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {itemNames.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>


        <div className="flex items-end gap-2">
          <button
            onClick={() => setFilters(tempFilters)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              const reset = {
                plant: "",
                sensor: "",
                item: "",
                categories: { A: false, B: false, C: false, D: false },
                start_date: "",
                end_date: "",
                dateFilter: "",
              };
              setTempFilters(reset);
              setFilters(reset);
            }}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Charts */}
      {activeMetric === "production" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Production Metrics (Bar)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Legend />
                <Bar dataKey="Scanned" fill="#3182ce" />
                <Bar dataKey="Processed" fill="#38a169" />
                <Bar dataKey="Discarded" fill="#e53e3e" />
                <Bar dataKey="Errored" fill="#ed8936" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Production Metrics (Line)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="Scanned" stroke="#3182ce" />
                <Line type="monotone" dataKey="Processed" stroke="#38a169" />
                <Line type="monotone" dataKey="Discarded" stroke="#e53e3e" />
                <Line type="monotone" dataKey="Errored" stroke="#ed8936" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeMetric === "weight" && (
        <div className="bg-white p-4 rounded shadow max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Weight Metrics (Current Weight Over Time)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="Weight" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeMetric === "quality" && (
        <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Quality Metrics (Category Proportions)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {qualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ViewAnalysis;
