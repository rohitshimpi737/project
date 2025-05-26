import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Dashboard from "./components/Dashboard";
import SensorManagement from "./components/SensorManagement";
import DashboardLayout from "./components/DashboardLayout";
import SensorDetails from "./components/SensorDetails";
import EnergyConsumption from "./components/EnergyConsumption";
import ProductAnalysis from "./components/ProductAnalysis";
import EnergyAnalysis from "./components/EnergyAnalysis";
import ProfilePage from "./components/ProfilePage";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

// plants
import PlantList from './pages/plant/PlantList';
import AddPlantForm from "./pages/plant/AddPlantForm";
import EditPlantForm from "./pages/plant/EditPlantForm";
import PlantDetailLayout from "./pages/plant/PlantDetailLayout";
import PlantOverview from "./pages/plant/PlantOverview";
import PlantReports from "./pages/plant/PlantReports";
import PlantEnergy from "./pages/plant/PlantEnergy";
import PlantData from "./pages/plant/PlantData";
import PlantSensors from "./pages/plant/PlantSensors";
import SensorList from "./pages/sonsor/SensorList";
import SensorAdd from "./pages/sonsor/SensorAdd";
import SensorEdit from "./pages/sonsor/SensorEdit";
import ItemList from "./pages/item/ItemList";

import AddItem from "./pages/item/AddItem";
import EditItem from "./pages/item/EditItem";
import SensorData from "./pages/sensosr-data/SensorData";
import ViewAnalysis from "./pages/sensosr-data/ViewAnalysis";




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

          { path: "plants", element: <PlantList /> },
          { path: "plants/add", element: <AddPlantForm /> }, 
          { path: "plant/:id/edit", element: <EditPlantForm /> },
          // 🆕 Plant Detail Page with nested tabs
          {
            path: "plant/:id",
            element: <PlantDetailLayout />,
            children: [
              { path: "", element: <PlantOverview /> },
              { path: "sensors", element: <PlantSensors /> },
              { path: "energy", element: <PlantEnergy /> },
              { path: "data", element: <PlantData /> },
              { path: "reports", element: <PlantReports /> },
            ],
          },
          { path: "sensors/:filter", element: <SensorList /> },
          { path: "sensor/add", element: <SensorAdd /> }, 
          {path: "sensor/:id/edit", element: <SensorEdit /> }, 

          {path:"items", element: <ItemList />},
          { path: "items/add", element: <AddItem /> },
          {path:"items/:id/edit", element: <EditItem /> }, 

          // sensor-data
          {path:"sensor-data/", element :<SensorData/>},
          
          {path:"ViewAnalysis", element :<ViewAnalysis/>}
          
          

          
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
