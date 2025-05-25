// /api/sensorDataApi.js
import apiClient from "./apiClient";

/**
 * Sensor Data API Client
 * Handles fetching filtered, paginated sensor data
 */
const sensorDataApi = {
  /**
   * Fetch sensor data from `/sensor-data/` with filters.
   *
   * Supported query params:
   * - page
   * - pageSize (maps to `page_size`)
   * - sensorId
   * - itemId
   * - category: Array of A/B/C/D (e.g. ['A', 'C'])
   * - dateFilter: 'day' | 'week' | 'month'
   * - startDate, endDate (yyyy-mm-dd)
   *
   * Example:
   *   sensorDataApi.getFiltered({
   *     page: 1,
   *     pageSize: 10,
   *     sensorId: 2,
   *     category: ['A', 'B'],
   *     dateFilter: 'week',
   *   })
   */
  getFiltered: (params = {}) => {
    const query = new URLSearchParams();
    console.log("Fetching sensor data with params:", params);

    if (params.page) query.append("page", params.page);
    if (params.page_size) query.append("page_size", params.page_size);
    if (params.sensor) query.append("sensor_id", params.sensor);
    if (params.item) query.append("item_id", params.item);
    if (params.category?.length)
      query.append("category", params.category.join(","));
    if (params.date_filter) query.append("date_filter", params.date_filter);
    if (params.start_date) query.append("start_date", params.start_date);
    if (params.end_date) query.append("end_date", params.end_date);
    if(params.plant) query.append("plant_id", params.plant);

     console.log("Query params:", query.toString());

    return apiClient.get(`sensor-data/?${query.toString()}`);
  },
};

export default sensorDataApi;
