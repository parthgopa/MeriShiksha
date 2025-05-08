import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Mylogo from "../../assets/MyLogonew.png";

const AdminHeader = () => {
  const { logout } = useAuth();
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
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-white hover:text-[var(--accent-teal)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
