// SensorDataTable.jsx
import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import EmptyState from "./EmptyState";

const SensorDataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyState 
      title="No data found"
      description="Try adjusting your filters to find what you're looking for."
      icon={<FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />}
    />;
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Sensor",
                    "Timestamp",
                    "Items Scanned",
                    "Processed",
                    "Discarded",
                    "Errors",
                    "Weight (kg)",
                    "Category A",
                    "Category B",
                    "Category C",
                    "Category D",
                  ].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {row.sensor_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.items_scanned.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.items_processed.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.items_processed.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.processed_with_errors.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {Number(row.current_weight_kg ?? 0).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.category_a.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.category_b.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.category_c.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                      {row.category_d.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataTable;