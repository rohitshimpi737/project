import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import EmptyState from "../sensosr-data/EmptyState";
import LoadingSpinner from "../sensosr-data/LoadingSpinner";

const DailyEnergyLineChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <EmptyState
          title="No chart data available"
          description="There's no data to display for this chart."
          compact
        />
      </div>
    );
  }

  // Ensure data has the required properties
  const chartData = data.map(item => ({
    date: item.date || '',
    energy_kwh: Number(item.energy_kwh) || 0,
    cost_inr: Number(item.cost_inr) || 0
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Daily Energy Usage</h3>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              label={{
                value: 'Date',
                position: 'bottom',
                offset: 20
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Energy (kWh)',
                angle: -90,
                position: 'left',
                offset: 10
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Cost (₹)',
                angle: -90,
                position: 'right',
                offset: 10
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="energy_kwh"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Energy (kWh)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cost_inr"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Cost (₹)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyEnergyLineChart;