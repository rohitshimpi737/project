import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data (Replace with API data later)
const sampleData = [
  { time: "10 AM", energy: 120 },
  { time: "11 AM", energy: 200 },
  { time: "12 PM", energy: 180 },
  { time: "1 PM", energy: 220 },
  { time: "2 PM", energy: 250 },
];

const EnergyChart = ({ detailedView = false }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4">
        {detailedView
          ? "Detailed Energy Consumption Trends"
          : "Energy Usage Overview"}
      </h3>

      <ResponsiveContainer width="100%" height={detailedView ? 300 : 250}>
        <LineChart data={sampleData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#4CAF50"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyChart;
