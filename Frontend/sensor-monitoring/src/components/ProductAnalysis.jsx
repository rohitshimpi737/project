import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MetricCard, LineChart, DataTable } from "../components";
import { Pie } from "react-chartjs-2";

const ProductAnalysis = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("week");

  // Mock data - replace with API calls later
  const hourlyData = {
    labels: Array(24)
      .fill()
      .map((_, i) => `${i}:00`),
    datasets: [
      {
        label: "Items Processed",
        data: Array(24)
          .fill()
          .map(() => Math.floor(Math.random() * 1000)),
        borderColor: "#3B82F6",
        tension: 0.1,
      },
    ],
  };

  const categoryData = {
    labels: ["Category A", "Category B", "Category C", "Category D"],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const tableData = Array(24)
    .fill()
    .map((_, i) => ({
      hour: `${i}:00 - ${i + 1}:00`,
      processed: Math.floor(Math.random() * 1000),
      errors: Math.floor(Math.random() * 50),
      efficiency: `${Math.floor(Math.random() * 20 + 80)}%`,
    }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Back to Previous
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Product Analysis</h1>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Processed"
          value="12,345"
          trend={{ value: "+12%", direction: "up" }}
        />
        <MetricCard
          title="Discarded Items"
          value="234"
          trend={{ value: "-5%", direction: "down" }}
        />
        <MetricCard
          title="Processing Errors"
          value="45"
          trend={{ value: "+2%", direction: "up" }}
        />
        <MetricCard title="Avg. Efficiency" value="92.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Hourly Processing Rate</h3>
          <LineChart data={hourlyData} title="Items Processed Per Hour" />
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
          <div className="h-64">
            <Pie
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right" },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">
          Detailed Hourly Breakdown
        </h3>
        <DataTable
          columns={[
            { key: "hour", header: "Time Window" },
            { key: "processed", header: "Processed Items" },
            { key: "errors", header: "Errors" },
            { key: "efficiency", header: "Efficiency" },
          ]}
          data={tableData}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default ProductAnalysis;
