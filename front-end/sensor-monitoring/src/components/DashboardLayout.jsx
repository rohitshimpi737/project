import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-600">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="hover:underline text-blue-600">
              Home
            </Link>
            <span> / </span>
          </li>
          {paths.map((path, index) => {
            const url = `/${paths.slice(0, index + 1).join("/")}`;
            return (
              <li key={index}>
                <Link
                  to={url}
                  className="hover:underline text-blue-600 capitalize"
                >
                  {path.replace("-", " ")}
                </Link>
                {index !== paths.length - 1 && <span> / </span>}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
