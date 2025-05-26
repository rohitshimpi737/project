import { useEffect, useState } from "react";
import { FiFilter, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import FilterBar from "./FilterBar";
import EnergyTable from "./EnergyTable";
import LoadingSpinner from "../sensosr-data/LoadingSpinner";
import energyApi from "../../api/energyApi";
import DailyEnergyLineChart from "./LineChart";
import SensorCostBarChart from "./BarChart";

const EnergyDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [filters, setFilters] = useState({
    plant: "",
    sensor: "",
    start_date: "",
    end_date: "",
    date_filter: "",
  });

  const [activeFilters, setActiveFilters] = useState({
    plant: "",
    sensor: "",
    start_date: "",
    end_date: "",
    date_filter: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // Chart data states
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(false);

  // Map filters to API params
  const mapFiltersToApiParams = (filtersObj) => ({
    plant: filtersObj.plant || undefined,
    sensor: filtersObj.sensor || undefined,
    start_date: filtersObj.start_date || undefined,
    end_date: filtersObj.end_date || undefined,
    date_filter: filtersObj.date_filter || undefined,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiParams = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...activeFilters,
      };
      const res = await energyApi.getLogs(apiParams);
      const results = res.data.results || res.data;
      const count = res.data.count || res.data.totalCount || 0;
      setData(results);
      setPagination((prev) => ({
        ...prev,
        totalCount: count,
      }));
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load energy data. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data
  const fetchCharts = async () => {
    setChartsLoading(true);
    try {
      const params = mapFiltersToApiParams(activeFilters);
      const [lineRes, barRes] = await Promise.all([
        energyApi.getDailyMetrics({ ...params }),
        energyApi.getSensorCostMetrics({ ...params }),
      ]);
      setLineChartData(lineRes.data);
      setBarChartData(barRes.data);
    } catch (err) {
      setLineChartData([]);
      setBarChartData([]);
    } finally {
      setChartsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
    fetchCharts();
  }, []);

  // Fetch when activeFilters or page changes
  useEffect(() => {
    fetchData();
  }, [activeFilters, pagination.page, pagination.pageSize]);

  // Fetch charts when filters change
  useEffect(() => {
    fetchCharts();
  }, [activeFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    const apiFilters = mapFiltersToApiParams(filters);
    setActiveFilters(apiFilters);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    fetchData();
    fetchCharts();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.plant) count++;
    if (activeFilters.sensor) count++;
    if (activeFilters.start_date) count++;
    if (activeFilters.end_date) count++;
    return count;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Energy Consumption</h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time monitoring and analysis of energy usage
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading || chartsLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiRefreshCw className={`mr-2 h-4 w-4 ${loading || chartsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="bg-white shadow-sm mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiFilter className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              <button
                onClick={applyFilters}
                disabled={loading || chartsLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading || chartsLoading ? 'Applying...' : 'Apply Filters'}
              </button>
            </div>
            {/* Filter Inputs */}
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Charts Section */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailyEnergyLineChart data={lineChartData} loading={chartsLoading} />
            <SensorCostBarChart data={barChartData} loading={chartsLoading} />
          </div>
        </div> */}

      {/* Charts Section */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="grid grid-cols-1 gap-6"> {/* Changed to single column */}
    <div className="bg-white rounded-lg shadow p-6">
      <DailyEnergyLineChart data={lineChartData} loading={chartsLoading} />
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <SensorCostBarChart data={barChartData} loading={chartsLoading} />
    </div>
  </div>
</div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Please check your connection and try again.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={fetchData}
                      className="text-sm font-medium text-red-700 hover:text-red-600"
                    >
                      Retry <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
              <div className="overflow-x-auto ">
                <EnergyTable
                  data={data}
                  pagination={pagination}
                  onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                  onPageSizeChange={handlePageSizeChange}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
            {data.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{' '}
                {pagination.totalCount} records
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnergyDashboard;