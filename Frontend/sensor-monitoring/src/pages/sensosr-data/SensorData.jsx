import { useEffect, useState } from "react";
import { FiFilter, FiRefreshCw, FiAlertCircle, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FilterBar from "./FilterBar";
import SensorDataTable from "./SensorDataTable";
import PaginationControls from "./PaginationControls";
import sensorDataApi from "../../api/sensorDataApi";
import LoadingSpinner from "./LoadingSpinner";


const SensorData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [filters, setFilters] = useState({
        plant: "",
        sensor: "",
        item: "",
        categories: { A: false, B: false, C: false, D: false },
        start_date: "",
        end_date: "",
        dateFilter: "",
    });

    const [activeFilters, setActiveFilters] = useState({
        plant: "",
        sensor: "",
        item: "",
        category: [],
        start_date: "",
        end_date: "",
        dateFilter: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        totalCount: 0,
    });

    const mapFiltersToApiParams = (filtersObj) => {
        const selectedCategories = Object.entries(filtersObj.categories)
            .filter(([_, checked]) => checked)
            .map(([key]) => key);

        return {
            plant: filtersObj.plant || undefined,
            sensor: filtersObj.sensor || undefined,
            item: filtersObj.item || undefined,
            category: selectedCategories.length > 0 ? selectedCategories : undefined,
            start_date: filtersObj.start_date || undefined,
            end_date: filtersObj.end_date || undefined,
            date_filter: filtersObj.dateFilter || undefined,
        };
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiParams = {
                page: pagination.page,
                page_size: pagination.pageSize,
                ...activeFilters,
            };

            const response = await sensorDataApi.getFiltered(apiParams);
            const results = response.data.results || response.data;
            const count = response.data.count || response.data.totalCount || 0;

            console.log("Fetched sensor data:", results);
            setData(results);
            setPagination((prev) => ({
                ...prev,
                totalCount: count,
            }));
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to load sensor data. Please try again.");
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch when activeFilters or page changes
    useEffect(() => {
        fetchData();
    }, [activeFilters, pagination.page, pagination.pageSize]);

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
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (activeFilters.plant) count++;
        if (activeFilters.sensor) count++;
        if (activeFilters.item) count++;
        if (activeFilters.category?.length > 0) count++;
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
                            <h1 className="text-2xl font-semibold text-gray-900">Sensor Data</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Real-time monitoring and analysis of sensor data
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
                                disabled={loading}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col h-full">
  <div className="bg-white shadow-sm mt-4" >
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
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Applying...' : 'Apply Filters'}
        </button>
      </div>

      {/* Filter Inputs */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
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
                                <SensorDataTable data={data} />
                            </div>
                            <PaginationControls
                                page={pagination.page}
                                pageSize={pagination.pageSize}
                                totalCount={pagination.totalCount}
                                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                                onPageSizeChange={handlePageSizeChange}
                            />
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

export default SensorData;