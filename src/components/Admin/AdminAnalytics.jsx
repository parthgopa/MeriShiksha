import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaUsers, FaUserShield, FaChartLine, FaDatabase } from "react-icons/fa";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For expanding tables
  const [showUsers, setShowUsers] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [showApiUsage, setShowApiUsage] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[var(--primary-black)] text-white">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Platform Analytics</h1>
      {loading ? (
        <div className="flex justify-center items-center" style={{height: '200px'}}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-teal)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10">
              <FaUsers className="h-8 w-8 text-blue-400" />
            </div>
            <h5 className="text-xl font-bold text-white text-center mb-2">Total Users</h5>
            <p className="text-4xl font-bold text-blue-400 text-center">{stats.total_users}</p>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10">
              <FaUserShield className="h-8 w-8 text-green-400" />
            </div>
            <h5 className="text-xl font-bold text-white text-center mb-2">Total Admins</h5>
            <p className="text-4xl font-bold text-green-400 text-center">{stats.total_admins}</p>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10">
              <FaDatabase className="h-8 w-8 text-yellow-400" />
            </div>
            <h5 className="text-xl font-bold text-white text-center mb-2">API Calls Remaining</h5>
            <p className="text-4xl font-bold text-yellow-400 text-center">{stats.api_calls_remaining}</p>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10">
              <FaChartLine className="h-8 w-8 text-red-400" />
            </div>
            <h5 className="text-xl font-bold text-white text-center mb-2">API Calls Used</h5>
            <p className="text-4xl font-bold text-red-400 text-center">{stats.api_calls_used}</p>
          </div>
        </div>
      )}
        </div>
      </main>
      
      <AdminFooter />
    </div>
  );
};

export default AdminAnalytics;
