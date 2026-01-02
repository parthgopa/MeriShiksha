import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[var(--primary-black)] text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About Us</h3>
            <p className="text-gray-400 mb-4">
              Meri Shiksha is an AI-powered educational platform designed to empower both learners and tutors with innovative tools and resources.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white hover:text-[var(--accent-teal)] transition-colors">Home</Link></li>
              <li><Link to="/aboutUs" className="text-white hover:text-[var(--accent-teal)] transition-colors">About Us</Link></li>
              <li><Link to="/contactUs" className="text-white hover:text-[var(--accent-teal)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@merishiksha.com" className="text-white">info@merishiksha.com</a>
              </li>
              {/* <li>
                <span className="text-lg text-white font-semibold">
                 <FaPhoneAlt size={20} /> +91 1234567890
                </span>
              </li> */}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Meri Shiksha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
