import apiClient from "./apiClient";

const plantApi = {
  getAll: () => apiClient.get("plants/"),            // GET /api/plants/
  getById: (id) => apiClient.get(`plants/${id}/`),   // GET /api/plants/:id/
  create: (data) => apiClient.post("plants/", data), // POST /api/plants/
  update: (id, data) => apiClient.put(`plants/${id}/`, data), // PUT /api/plants/:id/
  delete: (id) => apiClient.delete(`plants/${id}/`)  // DELETE /api/plants/:id/
};

export default plantApi;
