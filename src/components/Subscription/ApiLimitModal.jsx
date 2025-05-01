import React from "react";
import { Link } from "react-router-dom";

const ApiLimitModal = ({ onClose }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full border border-gray-800 overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Free Trial Limit Reached</h2>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 bg-[var(--accent-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-white text-lg mb-2">
              You've used all your free API calls!
            </p>
            <p className="text-gray-400">
              Upgrade to Premium to unlock unlimited access to all MeriShiksha's AI-powered learning tools.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link
              to="/subscription"
              className="w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all text-center"
            >
              Upgrade to Premium
            </Link>
            
            <button
              onClick={onClose}
              className="w-full bg-transparent border border-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiLimitModal;
