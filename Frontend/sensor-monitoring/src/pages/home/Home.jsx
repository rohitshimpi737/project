import React from "react";
import Navbar from "../../components/Navbar";
import {
  ChartBarIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const features = [
    {
      name: "Real-time Monitoring",
      description:
        "Track energy consumption and production metrics in real-time across all facilities",
      icon: ChartBarIcon,
    },
    {
      name: "Smart Sensors",
      description:
        "Integrated IoT sensors for precise equipment performance tracking",
      icon: CpuChipIcon,
    },
    {
      name: "Predictive Analytics",
      description:
        "AI-powered insights for energy optimization and maintenance forecasting",
      icon: LightBulbIcon,
    },
    {
      name: "Security First",
      description: "Enterprise-grade security with role-based access control",
      icon: ShieldCheckIcon,
    },
  ];

  const stats = [
    { name: "Sensors Monitored", value: "2500+" },
    { name: "Energy Saved", value: "45M kWh" },
    { name: "Operational Efficiency", value: "89%" },
    { name: "Supported Facilities", value: "150+" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              Intelligent Energy Management
              <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mt-4">
                For Sustainable Operations
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your industrial energy management with AI-driven
              insights, real-time sensor monitoring, and predictive maintenance
              solutions.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </a>
              <a
                href="/dashboard"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
              >
                Live Demo
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Comprehensive Energy Management Platform
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
                End-to-end solutions for industrial energy optimization,
                equipment monitoring, and sustainable operations management.
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <feature.icon className="h-12 w-12 text-blue-600" />
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative bg-blue-600">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="text-center">
                  <dt className="text-4xl font-extrabold text-white">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-lg font-medium text-blue-100">
                    {stat.name}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to Optimize Your Energy Usage?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Join hundreds of industrial operators already transforming their
              energy management systems.
            </p>
            <div className="mt-10">
              <a
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
