import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 Import useNavigate
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); 


  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate("/"); // 
  };

  return (
    <header className="w-full flex justify-between items-center px-[5%] py-4 bg-blue-700 sticky top-0 z-50">
      {/* Left Side - Logo */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
        YourLogo
      </h1>

      {/* Right Side - Auth Buttons or Profile */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            >
              <FaUserCircle className="text-3xl text-blue-100" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <span className="block px-4 py-2 text-gray-700 font-semibold">
                  {user.username}
                </span>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={() => setShowDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 ease border-2 border-blue-200 text-blue-100 bg-transparent hover:bg-blue-600 hover:border-blue-100"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 ease bg-white text-blue-700 hover:bg-blue-50 hover:shadow-md"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
