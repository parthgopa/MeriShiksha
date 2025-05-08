import React from 'react';
import { Link } from 'react-router-dom';
import Mylogo from "../../assets/MyLogonew.png";

const AdminFooter = () => {
  return (
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
            <Link to="/contactUs" className="text-gray-400 hover:text-[var(--accent-teal)] text-sm transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
