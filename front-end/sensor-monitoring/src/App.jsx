import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import SensorManagement from "./components/SensorManagement";
import DashboardLayout from "./components/DashboardLayout";
import SensorDetails from "./components/SensorDetails";
import EnergyConsumption from "./components/EnergyConsumption";
import ProductAnalysis from "./components/ProductAnalysis";
import EnergyAnalysis from "./components/EnergyAnalysis";
import ProfilePage from "./components/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute"; // Import PrivateRoute

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "profile",
    element: <PrivateRoute />, // Protect Profile Page
    children: [{ path: "", element: <ProfilePage /> }],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />, // Protect Dashboard
    children: [
      {
        path: "",
        element: <DashboardLayout />, // Dashboard Layout
        children: [
          { path: "", element: <Dashboard /> },
          { path: "sensor-management", element: <SensorManagement /> },
          { path: "sensor-management/:id", element: <SensorDetails /> },
          { path: "energy-consumption", element: <EnergyConsumption /> },
          { path: "product-analysis", element: <ProductAnalysis /> },
          { path: "energy-analysis", element: <EnergyAnalysis /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;
