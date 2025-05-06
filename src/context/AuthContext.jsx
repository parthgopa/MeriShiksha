import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post("/api/user/login", { email, password });
      
      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login");
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await api.post("/api/user/register", userData);
      
      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during registration");
      throw err;
    }
  };

  const logout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    setError(null);
    try {
      // If userData is directly provided (e.g., from API response), use it directly
      if (!userData.hasOwnProperty('name')) {
        console.log('Updating user profile with API data:', userData);
        // Update user data in localStorage
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setCurrentUser(updatedUser);
        return updatedUser;
      }
      
      // Otherwise, make an API call to update the profile
      console.log('Updating user profile with form data');
      const response = await api.put("/api/user/profile", userData);
      
      // Update user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      
      setCurrentUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while updating profile");
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
