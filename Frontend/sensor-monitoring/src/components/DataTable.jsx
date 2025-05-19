import { useState, useMemo } from "react";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const DataTable = ({ columns, data, pageSize = 10 }) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const requestSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-xs px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => requestSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {sortConfig?.key === col.key &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    ))}
                  {!sortConfig?.key === col.key && (
                    <ChevronUpDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage * pageSize >= filteredData.length}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
