import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getUser();
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        // Handle invalid/expired token
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.warn("No refresh token found. Skipping logout API call.");
        return;
      }
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
