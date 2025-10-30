import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Collapse sidebar by default on smaller screens
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout successfully");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-xl flex flex-col transition-all duration-300 overflow-hidden fixed h-full`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg">
          {sidebarOpen ? "PM APP" : "PM"}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 border-l-4 border-indigo-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiHome />
            {sidebarOpen && "Dashboard"}
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 border-l-4 border-indigo-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiUser />
            {sidebarOpen && "Projects"}
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 border-l-4 border-indigo-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiSettings />
            {sidebarOpen && "Tasks"}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Topbar */}
        <header className="backdrop-blur-md bg-white/80 shadow-md sticky top-0 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Project Management App
            </h2>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 md:gap-3 focus:outline-none"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border"
              />
              <span className="hidden md:flex items-center text-gray-700 font-medium gap-1">
                Welcome, {userName || "User"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  );
}
