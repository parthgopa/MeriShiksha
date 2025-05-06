import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaUsers, FaUserShield, FaChartLine, FaDatabase } from "react-icons/fa";

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
    <div className="container w-screen py-5">
      <h1 className="mb-4 fw-bold text-center">Platform Analytics</h1>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '200px'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">{error}</div>
      ) : (
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <FaUsers size={36} className="mb-2 text-primary" />
                <h5 className="card-title">Total Users</h5>
                <p className="display-5 fw-bold text-primary mb-0">{stats.total_users}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <FaUserShield size={36} className="mb-2 text-success" />
                <h5 className="card-title">Total Admins</h5>
                <p className="display-5 fw-bold text-success mb-0">{stats.total_admins}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <FaDatabase size={36} className="mb-2 text-warning" />
                <h5 className="card-title">API Calls Remaining</h5>
                <p className="display-5 fw-bold text-warning mb-0">{stats.api_calls_remaining}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <FaChartLine size={36} className="mb-2 text-danger" />
                <h5 className="card-title">API Calls Used</h5>
                <p className="display-5 fw-bold text-danger mb-0">{stats.api_calls_used}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
