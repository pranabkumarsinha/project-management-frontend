import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function EditProject() {
  const navigate = useNavigate();

  // form fields
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // feedback states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(response.data.name);
        setDescription(response.data.description);
        setDueDate(response.data.due_date); // note key change below
      } catch (error) {
        console.error("Error loading project:", error);
      }
    };

    fetchProject(); // ✅ correct place
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/projects/${id}`,
        { name, description, due_date: dueDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Project edited successfully!");
      toast.success("Project edited successfully!");
      setName("");
      setDescription("");
      setDueDate("");

      // redirect after 1.5 sec
      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    } catch (err) {
      toast.error("Error editing project!");
      console.error("Error adding project:", err);
      setError(
        err.response?.data?.message || "❌ Failed to add project. Try again."
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
            Edit Project
          </h2>

          <form className="space-y-4 w-full" onSubmit={handleUpdate}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Enter project description"
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
