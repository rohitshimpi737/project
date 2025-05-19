import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import authApi from "../../api/authApi"; 
import { useAuth } from "../../context/AuthContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.login({ email, password });

      // STEP 1: Save tokens FIRST
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // STEP 2: Update AuthContext
      login(data.access_token, data.user,data.refresh_token);

      // STEP 3: Navigate after tokens are saved
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg w-full max-w-md p-6 border border-gray-300 shadow-md">
          <div className="text-center mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-blue-600 font-medium p-1 mb-3 hover:text-blue-700"
            >
              <FaArrowLeft className="text-lg" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 text-sm mt-1">
              Sign in to manage your energy consumption
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-400 text-xs mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white rounded-md font-semibold text-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4 text-xs">
            <Link
              to="/forgot-password"
              className="text-gray-500 hover:text-blue-500"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="text-center mt-2 text-xs">
            <span className="text-gray-700">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:opacity-80"
              >
                Create Account
              </Link>
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="flex items-center gap-2 px-5 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-200 transition text-sm">
              <FcGoogle className="text-lg" />
              Login via Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
