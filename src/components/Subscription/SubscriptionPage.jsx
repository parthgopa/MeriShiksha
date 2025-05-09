import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Mylogo from "../../assets/MyLogonew.png";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubscribe = () => {
    navigate("/payment", { state: { plan: "premium", amount: 250 } });
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--primary-black)] text-white py-8 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header - More compact */}
        <div className="text-center mb-6">
          <img src={Mylogo} alt="MeriShiksha Logo" className="h-16 mx-auto mb-2" />
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-[var(--accent-teal)]">Premium</span> Learning Experience
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Unlock unlimited access to all MeriShiksha's AI-powered learning tools
          </p>
        </div>
        

        {/* Two-column layout for larger screens */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-8 mt-4">
          {/* Subscription Card */}
          <div className="max-w-md mx-auto md:mx-0 md:w-1/2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl h-full">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] px-6 py-4 text-center">
                <h2 className="text-2xl font-bold text-white">Premium Plan</h2>
                <div className="mt-2 flex items-center justify-center">
                  <span className="text-4xl font-bold">₹250</span>
                  <span className="ml-2 text-base opacity-80">/month</span>
                </div>
                <p className="mt-1 text-white opacity-90 text-sm">or ₹2,500/year (save ₹500)</p>
              </div>

              {/* Features - More compact */}
              <div className="p-5">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[var(--accent-teal)] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited AI-powered learning sessions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[var(--accent-teal)] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized career guidance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[var(--accent-teal)] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced topic exploration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[var(--accent-teal)] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-[var(--accent-teal)] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Download learning materials</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right side with usage info and CTA */}
          <div className="max-w-md mx-auto md:mx-0 md:w-1/2 flex flex-col justify-center">
            {/* Current Usage */}
            {currentUser && (
              <div className="p-4 bg-gray-800 rounded-lg mb-6">
                <h3 className="font-medium mb-2 text-white">Your Current Usage</h3>
                <div className="flex justify-between items-center">
                  <span>API Calls Remaining:</span>
                  <span className="font-bold text-[var(--accent-teal)]">
                    {currentUser.api_calls_remaining || 0}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50"
            >
              Subscribe Now
            </button>
            
            <p className="text-center text-sm text-gray-400 mt-4">
              Secure payment powered by Paytm
            </p>
            
            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-gray-400 hover:text-[var(--accent-teal)] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
