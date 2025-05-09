import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle, IoMailOutline, IoPhonePortraitOutline, IoKeyOutline, IoCalendarOutline, IoSchoolOutline } from "react-icons/io5";
import HomeButton from "./HomeButton";
import Footer from "./Home/Footer";
import Header from "./Home/Header";

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
    created_at: null,
  });
  const [message, setMessage] = useState("");
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          backendURL + "/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
        backendURL + "/api/user/profile",
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
        backendURL + "/api/user/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg("Password updated successfully.");
      setPasswordData({ current_password: "", new_password: "" });
    } catch (error) {
      setPasswordMsg(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (

    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <Header/>
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Your Profile
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary-violet)]/80 to-[var(--accent-teal)]/80 px-6 py-4 border-b border-[var(--accent-teal)]/20">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <IoPersonCircle className="mr-2 text-3xl" /> Profile Information
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-white flex items-center"
                >
                  <IoPersonCircle className="mr-2" /> Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={user.name || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-white flex items-center"
                >
                  <IoMailOutline className="mr-2" /> Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={user.email || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="phone"
                  className="block text-lg font-medium text-white flex items-center"
                >
                  <IoPhonePortraitOutline className="mr-2" /> Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={user.phone || ""}
                    onChange={handleChange}
                    className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-lg transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
              >
                <span>Update Profile</span>
              </button>

              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg flex items-center ${
                    message.includes("success")
                      ? "bg-green-500/20 border border-green-500 text-green-100"
                      : "bg-red-500/20 border border-red-500 text-white"
                  }`}
                >
                  {message.includes("success") ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>

        {/* Right Column - Account Info & Password Change */}
        <div className="space-y-8">
            {/* Account Information */}
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary-violet)]/80 to-[var(--accent-teal)]/80 px-6 py-4 border-b border-[var(--accent-teal)]/20">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <IoSchoolOutline className="mr-2 text-3xl" /> Account Details
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-[var(--primary-black)]/30 p-4 rounded-lg border border-[var(--accent-teal)]/10">
                  <p className="text-[var(--accent-teal)] mb-2 flex items-center">
                    <IoCalendarOutline className="mr-2" /> Joined
                  </p>
                  <p className="font-medium text-white text-lg">
                    {formatDateTime(user.created_at)}
                  </p>
                </div>
                
                <div className="bg-[var(--primary-black)]/30 p-4 rounded-lg border border-[var(--accent-teal)]/10">
                  <p className="text-[var(--accent-teal)] mb-2 flex items-center">
                    <IoCalendarOutline className="mr-2" /> Last Login
                  </p>
                  <p className="font-medium text-white text-lg">
                    {formatDateTime(user.last_logged_in)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          {/* <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary-violet)]/80 to-[var(--accent-teal)]/80 px-6 py-4 border-b border-[var(--accent-teal)]/20">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <IoKeyOutline className="mr-2 text-3xl" /> Change Password
              </h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="current_password"
                  className="block text-lg font-medium text-white flex items-center"
                >
                  <IoKeyOutline className="mr-2" /> Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="new_password"
                  className="block text-lg font-medium text-white flex items-center"
                >
                  <IoKeyOutline className="mr-2" /> New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-4 rounded-lg bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-lg transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
              >
                <span>Update Password</span>
              </button>

              {passwordMsg && (
                <div
                  className={`mt-4 p-4 rounded-lg flex items-center ${
                    passwordMsg.includes("success")
                      ? "bg-green-500/20 border border-green-500 text-green-100"
                      : "bg-red-500/20 border border-red-500 text-white"
                  }`}
                >
                  {passwordMsg.includes("success") ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  <span>{passwordMsg}</span>
                </div>
              )}
            </form>
          </div> */}
        </div> 
        
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
    <Footer/>

  </div>  

  );
};

export default Profile;
