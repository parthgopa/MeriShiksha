import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Mylogo from "../../assets/MyLogonew.png";
import api from "../../api/axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Attempt to login using admin login endpoint
      const response = await api.post("/api/admin/login", {
        email: formData.email,
        password: formData.password
      });
      
      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[var(--primary-black)] p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/10 to-[var(--primary-black)]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--primary-violet)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent-teal)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <img src={Mylogo} alt="MeriShiksha Logo" className="h-20 mx-auto mb-4" />
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2 uppercase">
              Admin
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            <span className="text-[var(--accent-teal)]">Admin</span> Portal
          </h1>
          <p className="text-gray-400 mt-2">Sign in to access administrative controls</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-800">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all"
                placeholder="Enter your admin email"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-gray-300 text-sm font-medium"
                >
                  Password
                </label>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign In as Administrator"}
            </button>

            <div className="mt-6 text-center text-gray-400 text-sm">
              Need an admin account?{" "}
              <Link
                to="/admin/register"
                className="text-[var(--accent-teal)] hover:text-[var(--accent-teal)]/80 transition-colors"
              >
                Register as Admin
              </Link>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-[var(--accent-teal)] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
