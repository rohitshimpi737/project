import apiClient from "./apiClient";

const authApi = {
  signup: (userData) => apiClient.post("auth/register/", userData),
  login: (credentials) => apiClient.post("auth/login/", credentials),
  logout: (refreshToken) =>
    apiClient.post("auth/logout/", { refresh_token: refreshToken }),

  getUser: () => apiClient.get("auth/me/"),

  updateProfile: (userData) => apiClient.put("profile/update/", userData),
};

export default authApi;
