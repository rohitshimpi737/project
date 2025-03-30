import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MetricCard, LineChart, DataTable } from "../components";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const EnergyAnalysis = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("month");

  // Mock data - replace with API calls later
  const consumptionData = {
    labels: ["Shredder", "Conveyor", "Scanner", "Cooling"],
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: [6500, 4200, 1500, 2300],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const costData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Energy Costs",
        data: [4500, 4200, 4800, 4600, 4300],
        borderColor: "#10B981",
        tension: 0.1,
      },
    ],
  };

  const sourceData = {
    labels: ["Solar", "Grid", "Generator"],
    datasets: [
      {
        data: [35, 50, 15],
        backgroundColor: ["#F59E0B", "#3B82F6", "#EF4444"],
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Energy Analysis</h1>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard title="Total Consumption" value="45,230 kWh" />
        <MetricCard
          title="Cost Savings"
          value="₹12,450"
          trend={{ value: "+18%", direction: "up" }}
        />
        <MetricCard title="Peak Demand" value="2,450 kW" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            Energy Consumption by Machine
          </h3>
          <div className="h-64">
            <Bar
              data={consumptionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Energy Cost Trends</h3>
          <LineChart data={costData} title="Monthly Energy Costs ()" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Energy Sources</h3>
          <div className="h-64">
            <Pie
              data={sourceData}
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

        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Detailed Consumption</h3>
          <DataTable
            columns={[
              { key: "machine", header: "Machine" },
              { key: "consumption", header: "Consumption (kWh)" },
              { key: "cost", header: "Cost (₹)" },
              { key: "efficiency", header: "Efficiency" },
            ]}
            data={[
              {
                machine: "Shredder",
                consumption: 6500,
                cost: 4500,
                efficiency: "78%",
              },
              {
                machine: "Conveyor",
                consumption: 4200,
                cost: 3200,
                efficiency: "85%",
              },
              // ... more data
            ]}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
};

export default EnergyAnalysis;
