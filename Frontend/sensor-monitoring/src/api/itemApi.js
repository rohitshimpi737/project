import apiClient from "./apiClient";

const itemApi = {
getAll: () => apiClient.get("items/"),
getById: (id) => apiClient.get(`items/${id}`),
create: (data) => apiClient.post("items/", data),
update: (id, data) => apiClient.put(`items/${id}/`, data),
delete: (id) => apiClient.delete(`items/${id}/`)
};

export default itemApi;