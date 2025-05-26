import React from "react";
import { format } from "date-fns";

export default function EnergyTable({ data, pagination, onPageChange, onPageSizeChange, loading, error }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Energy Logs</h2>

      {loading && (
        <div className="text-center text-blue-500 font-medium py-4">
          Loading data...
        </div>
      )}
      {error && (
        <div className="text-center text-red-500 font-medium py-4">{error}</div>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="text-center text-gray-500 font-medium py-4">
          No data available.
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">Sensor</th>
                <th className="px-4 py-2">Plant</th>
                <th className="px-4 py-2">Energy (kWh)</th>
                <th className="px-4 py-2">Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((log) => (
                <tr
                  key={log.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-4 py-2">{log.sensor_name}</td>
                  <td className="px-4 py-2">{log.plant_name}</td>
                  <td className="px-4 py-2">  {Number(log.energy_kwh).toFixed(2)}</td>
                  <td className="px-4 py-2">₹{Number(log.cost).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && pagination.totalCount > pagination.pageSize && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.page} of {Math.ceil(pagination.totalCount / pagination.pageSize)}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === Math.ceil(pagination.totalCount / pagination.pageSize)}
            className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}