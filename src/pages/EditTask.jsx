import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../axios";
import { toast } from "react-toastify";

export default function EditTask() {
  const navigate = useNavigate();

  // form fields
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  // feedback states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskAndProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        // Project response
        const projectResponse = await api.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectResponse.data);

        // Get Task data
        const taskResponse = await api.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectId(taskResponse.data.project_id);
        setTitle(taskResponse.data.title);
        setDescription(taskResponse.data.description);
        setDueDate(taskResponse.data.due_date);
        setStatus(taskResponse.data.status);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("❌ Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndProjects();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/tasks/${id}`,
        {
          project_id: projectId,
          title,
          description,
          due_date: dueDate,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Task updated successfully!");
      toast.success("Task updated successfully");
      setProjectId("");
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("");

      // redirect after 1.5 sec
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Error adding task!");
      setError(
        err.response?.data?.message || "❌ Failed to add task. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="w-full bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Task
          </h2>

          <form className="space-y-4 w-full" onSubmit={handleSubmit}>
            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
              >
                <option value="">--Select Project--</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
                ;
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Enter task description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                required
              ></textarea>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
              >
                <option value="">--Select Status--</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } text-white py-3 px-4 rounded-md shadow transition`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Messages */}
            {message && (
              <p className="text-green-600 font-medium text-center">
                {message}
              </p>
            )}
            {error && (
              <p className="text-red-600 font-medium text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
