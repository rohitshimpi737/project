import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  Cpu,
  BatteryCharging,
  Package,
  MoreHorizontal,
  Power,
  CircleDot,
  List,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isSubActive = (pathPrefix) => location.pathname.startsWith(pathPrefix);

  const linkClass = (active) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
      active
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const subLinkClass = (active) =>
    `flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-colors ${
      active ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-500"
    }`;

  return (
    // <aside className="w-64 bg-white border-r shadow-md hidden md:block min-h-screen">
    <aside className="fixed top-20 left-0 h-screen w-64 bg-white border-r shadow-md z-40 overflow-y-auto hidden md:block">
      <div className="p-4 space-y-6">
        <nav className="space-y-4 text-sm">
          <Link to="/dashboard" className={linkClass(isActive("/dashboard"))}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link to="/dashboard/plants" className={linkClass(isSubActive("/dashboard/plants"))}>
            <Leaf className="w-5 h-5" />
            Plants
          </Link>

          {/* Sensor Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 pl-1 uppercase tracking-wide">
              Sensors
            </p>
            <div className="ml-3 space-y-1">
              <Link
                to="/dashboard/sensors/all"
                className={subLinkClass(isActive("/dashboard/sensors/all"))}
              >
                <List className="w-4 h-4" />
                All
              </Link>
              <Link
                to="/dashboard/sensors/active"
                className={subLinkClass(isActive("/dashboard/sensors/active"))}
              >
                <CircleDot className="w-4 h-4 text-green-500" />
                Active
              </Link>
              <Link
                to="/dashboard/sensors/inactive"
                className={subLinkClass(isActive("/dashboard/sensors/inactive"))}
              >
                <CircleDot className="w-4 h-4 text-gray-400" />
                Inactive
              </Link>
            </div>
          </div>

          <Link to="/dashboard/items" className={linkClass(isSubActive("/dashboard/items"))}>
            <Package className="w-5 h-5" />
            Items
          </Link>

          <Link
            to="/dashboard/energy-consumption"
            className={linkClass(isSubActive("/dashboard/energy-consumption"))}
          >
            <BatteryCharging className="w-5 h-5" />
            Energy
          </Link>

          <Link to="/dashboard/other" className={linkClass(isSubActive("/dashboard/other"))}>
            <MoreHorizontal className="w-5 h-5" />
            Other
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
