import apiClient from "./apiClient";

const energyApi = {
  // Energy logs
  getLogs: (params) => apiClient.get("energy/", { params }),
  exportLogs: (params) => apiClient.get("energy/export/", { 
    params,
    responseType: "blob"
  }),

  // Energy metrics
  getDailyMetrics: () => apiClient.get("energy/metrics/", { params: { metric: "daily" } }),
  getSensorCostMetrics: () => apiClient.get("energy/metrics/", { params: { metric: "sensor-cost" } }),
};

export default energyApi;