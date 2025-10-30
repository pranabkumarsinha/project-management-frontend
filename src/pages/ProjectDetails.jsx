import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useParams } from "react-router-dom";
import api from "../axios";

export default function ProjectDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 2; // 👈 Change this number to adjust page size

  // Fetch project details from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectDetails(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("❌ Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);

  // Handle pagination
  const tasks = projectDetails?.tasks || [];
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Project Info Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {projectDetails?.name || "Project Details"}
          </h2>
          <p className="text-gray-600 mb-4">{projectDetails?.description}</p>
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-sm text-gray-500">Due Date</span>
              <p className="text-gray-800 font-medium">
                {projectDetails?.due_date}
              </p>
            </div>
          </div>
        </div>

        {/* Loading / Error / No Tasks */}
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <>
            {/* Tasks Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTasks.map((task, index) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {(currentPage - 1) * tasksPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {task.description}
                      </td>
                      <td className="px-6 py-4 text-yellow-600 font-medium">
                        {task.status}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {task.due_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  &laquo;
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 text-sm rounded-md mx-0.5 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white font-semibold"
                        : "text-gray-700 bg-transparent hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
