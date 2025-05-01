import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function formatDateTime(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString();
}

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    last_logged_in: null,
    first_logged_in: null,
    login_count: 0,
    created_at: null
  });
  const [message, setMessage] = useState("");
  const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "" });
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        setMessage(
          error.response ? error.response.data.message : error.message
        );
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/user/profile",
        { name: user.name, email: user.email, phone: user.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully.");
      setUser((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      setMessage(error.response ? error.response.data.message : error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/user/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg("Password updated successfully.");
      setPasswordData({ current_password: "", new_password: "" });
    } catch (error) {
      setPasswordMsg(error.response ? error.response.data.message : error.message);
    }
  };

  const navigate = useNavigate();
  
  return (
    <div className="max-w-6xl w-screen mx-auto px-4 py-12 mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-[var(--accent-teal)]">User</span> Profile
        </h2>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] px-6 py-4">
            <h3 className="text-xl font-bold text-white">Profile Information</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={user.name || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={user.email || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={user.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                id="role"
                value={user.role || ''}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white px-6 py-3 rounded-md hover:opacity-90 transition-colors font-medium"
            >
              Update Profile
            </button>
            
            {message && (
              <div className={`mt-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Right Column - Account Info & Password Change */}
        <div className="space-y-8">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] px-6 py-4">
              <h3 className="text-xl font-bold text-white">Account Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">{formatDateTime(user.last_logged_in)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">{formatDateTime(user.created_at)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Subscription Status</p>
                  <p className="font-medium">
                    {user.max_api_calls === -1 ? (
                      <span className="text-green-600 font-semibold">Premium (Unlimited)</span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Free Trial</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">API Calls Remaining</p>
                  <p className="font-medium">
                    {user.max_api_calls === -1 ? (
                      <span className="text-green-600">Unlimited</span>
                    ) : (
                      <span className={user.max_api_calls <= 5 ? "text-red-600 font-bold" : ""}>
                        {user.max_api_calls} / 50
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] px-6 py-4">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white px-6 py-3 rounded-md hover:opacity-90 transition-colors font-medium"
              >
                Update Password
              </button>
              
              {passwordMsg && (
                <div className={`mt-4 p-3 rounded-md ${passwordMsg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {passwordMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
