import React from 'react';
import { Link } from 'react-router-dom';
import Mylogo from "../../assets/MyLogonew.png";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const AdminDashboard = () => {

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[var(--primary-black)] text-white">
      <AdminHeader />

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
          
          {/* Marketing Card */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-teal)]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Email Marketing</h2>
            <p className="text-gray-400 text-center mb-6">
              Create and manage email marketing campaigns
            </p>
            <Link
              to="/admin/marketing"
              className="block w-full px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 text-center hover:opacity-90"
            >
              Manage Marketing
            </Link>
          </div>
        </div>
      </div>
      </main>
      
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
