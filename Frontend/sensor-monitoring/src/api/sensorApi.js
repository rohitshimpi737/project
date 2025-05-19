import apiClient from "./apiClient";

const sensorApi = {
  // GET /api/sensors/
  getAll: () => apiClient.get("sensors/"),

  // GET /api/sensors/?status=active or status=inactive
  getByStatus: (status) => apiClient.get(`sensors/?status=${status}`),

  // GET /api/sensors/:id/
  getById: (id) => apiClient.get(`sensors/${id}/`),

  // POST /api/sensors/
  create: (data) => apiClient.post("sensors/", data),

  // PUT /api/sensors/:id/
  update: (id, data) => apiClient.put(`sensors/${id}/`, data),

  // DELETE /api/sensors/:id/
  delete: (id) => apiClient.delete(`sensors/${id}/`),

  // GET http://127.0.0.1:8000/api/sensors/?plant=1
  getByPlant: (plantId) => apiClient.get(`sensors/?plant=${plantId}`),
};

export default sensorApi;
