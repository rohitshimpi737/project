import apiClient from "./apiClient";

const authApi = {
  signup: (userData) => apiClient.post("register/", userData),
  login: (credentials) => apiClient.post("login/", credentials),
  logout: (refreshToken) =>
    apiClient.post("logout/", { refresh_token: refreshToken }),

  getUser: () => apiClient.get("me/"),

  updateProfile: (userData) => apiClient.put("profile/update/", userData),
};

export default authApi;
