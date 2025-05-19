import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import authApi from "../../api/authApi"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.signup(formData);
      navigate("/login"); // Redirect after successful signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
            <h2 className="text-2xl font-bold text-gray-800">
              Create an Account
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Join us and start managing your energy consumption
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-400 text-xs mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                value={formData.username}
                name="username"
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                name="email"
                onChange={handleChange}
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
                value={formData.password}
                name="password"
                onChange={handleChange}
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
                value={formData.role}
                onChange={handleChange}
                name="role"
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-4 text-xs">
            <span className="text-gray-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:opacity-80"
              >
                Sign In
              </Link>
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="flex items-center gap-2 px-5 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-200 transition text-sm">
              <FcGoogle className="text-lg" />
              Sign Up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
