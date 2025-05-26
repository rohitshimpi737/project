import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import EmptyState from "../sensosr-data/EmptyState";
import LoadingSpinner from "../sensosr-data/LoadingSpinner";

const SensorCostBarChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <EmptyState
          title="No chart data available"
          description="There's no data to display for this chart."
          compact
        />
      </div>
    );
  }

  const chartData = data.map(item => ({
    sensor_name: item.sensor_name || 'Unknown',
    total_cost: Number(item.total_cost) || 0
  }));

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Cost per Sensor</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              dataKey="sensor_name" 
              type="category" 
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
              formatter={(value) => [`₹${value.toFixed(2)}`, "Total Cost"]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="total_cost" 
              fill="#6366f1" 
              name="Cost (₹)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorCostBarChart;