import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomeButton from '../HomeButton';
import Mylogo from "../../assets/MyLogonew.png";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-black)] text-white">
      {/* Admin Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={Mylogo} alt="MeriShiksha Logo" className="h-10 w-auto" />
                <div className="ml-2 flex flex-col">
                  <span className="text-xl font-bold text-white">MeriShiksha</span>
                  <span className="text-xs text-[var(--accent-teal)]">Admin Portal</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/admin/dashboard" className="text-white hover:text-[var(--accent-teal)] transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/admin/subscription-toggle" className="text-white hover:text-[var(--accent-teal)] transition-colors font-medium">
                Subscriptions
              </Link>
              <Link to="/admin/users" className="text-white hover:text-[var(--accent-teal)] transition-colors font-medium">
                Users
              </Link>
              <Link to="/admin/analytics" className="text-white hover:text-[var(--accent-teal)] transition-colors font-medium">
                Analytics
              </Link>
              <button 
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 py-2">
            <div className="px-4 space-y-2">
              <Link 
                to="/admin/dashboard" 
                className="block py-2 text-white hover:text-[var(--accent-teal)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/subscription-toggle" 
                className="block py-2 text-white hover:text-[var(--accent-teal)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Subscriptions
              </Link>
              <Link 
                to="/admin/users" 
                className="block py-2 text-white hover:text-[var(--accent-teal)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Users
              </Link>
              <Link 
                to="/admin/analytics" 
                className="block py-2 text-white hover:text-[var(--accent-teal)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Admin Dashboard
            </h1>
            <p className="text-xl text-teal-100">
              Manage and configure your MeriShiksha application
            </p>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subscription Toggle Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-teal)]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Subscription Control</h2>
            <p className="text-gray-400 text-center mb-6">
              Toggle between subscription-based and subscription-less models
            </p>
            <Link
              to="/admin/subscription-toggle"
              className="block w-full px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 text-center hover:opacity-90"
            >
              Manage Subscriptions
            </Link>
          </div>
          
          {/* Users Management Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-teal)]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">User Management</h2>
            <p className="text-gray-400 text-center mb-6">
              View and manage user accounts and permissions
            </p>
            <Link
              to="/admin/users"
              className="block w-full px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 text-center hover:opacity-90"
            >
              Manage Users
            </Link>
          </div>
          
          {/* Analytics Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-teal)]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Analytics</h2>
            <p className="text-gray-400 text-center mb-6">
              View usage statistics and platform analytics
            </p>
            <Link
              to="/admin/analytics"
              className="block w-full px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 text-center hover:opacity-90"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={Mylogo} alt="MeriShiksha Logo" className="h-8 w-auto" />
              <span className="ml-2 text-gray-300 text-sm">
                © {new Date().getFullYear()} MeriShiksha. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-[var(--accent-teal)] text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-[var(--accent-teal)] text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-[var(--accent-teal)] text-sm transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
