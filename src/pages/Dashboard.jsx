// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { FiShoppingCart } from "react-icons/fi";
import { GoProject } from "react-icons/go";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects_count: 0,
    tasks_count: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError("❌ Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="p-4 rounded-full bg-white/20">
              <GoProject size={32} />
            </div>
            <div>
              <h2 className="text-sm font-medium opacity-90">Projects</h2>
              <p className="text-3xl font-bold">
                <Link to="/projects" className="hover:underline">
                  {stats.projects_count}
                </Link>
              </p>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="p-4 rounded-full bg-white/20">
              <FiShoppingCart size={32} />
            </div>
            <div>
              <h2 className="text-sm font-medium opacity-90">Tasks</h2>
              <p className="text-3xl font-bold">
                <Link to="/tasks" className="hover:underline">
                  {stats.tasks_count}
                </Link>
              </p>
            </div>
          </div>

          {/* Example: Notifications / Users (Optional Future Cards) */}
          {/* 
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="p-4 rounded-full bg-white/20">
              <FiBell size={32} />
            </div>
            <div>
              <h2 className="text-sm font-medium opacity-90">Notifications</h2>
              <p className="text-3xl font-bold">12</p>
            </div>
          </div>
          */}
        </div>
      )}
    </DashboardLayout>
  );
}
