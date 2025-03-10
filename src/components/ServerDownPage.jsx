import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import img3 from "../assets/inputimages/img3.jpg";

const ServerDownPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const toggleRobotAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-8">
          <div
            className={`text-9xl cursor-pointer transition-all duration-300 hover:scale-110 ${
              isAnimating ? "animate-bounce" : ""
            }`}
            onClick={toggleRobotAnimation}
          >
            🤖
          </div>

          <img
            src={img3}
            alt="Career Guidance"
            className="w-full max-w-md rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-gray-700"
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-800/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Oops! Our Servers Are Taking a Quick Break
            </h1>

            <p className="text-gray-300 text-xl mb-8">
              Don't worry, our tech team is working their magic to get
              everything back up and running!
            </p>

            <div className="flex items-center justify-center mb-8 bg-gray-900/50 p-4 rounded-xl">
              <div className="animate-pulse h-4 w-4 bg-red-500 rounded-full"></div>
              <span className="ml-3 text-gray-300 text-lg">
                System Status: Maintenance Mode
              </span>
            </div>

            <div className="text-gray-300 text-lg mb-8">
              Page will refresh in:{" "}
              <span className="text-blue-400 font-bold">{countdown}</span>{" "}
              seconds
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-lg"
              >
                <span className="mr-2">🔄</span> Refresh Now
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-lg"
              >
                <span className="mr-2">🏠</span> Go Home
              </button>
            </div>

            <div className="bg-gray-900/30 p-6 rounded-xl">
              <h3 className="text-white text-xl font-semibold mb-4">
                While you wait, you can:
              </h3>
              <ul className="text-gray-300 space-y-4">
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-xl">📱</span> Follow us on social
                  media for updates
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-xl">📧</span> Contact support at
                  support@example.com
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-xl">⏰</span> Check back in a few
                  minutes
                </li>
              </ul>
            </div>

            <div className="mt-8 text-gray-400 text-base italic">
              <p>Did you know? Even servers need coffee breaks sometimes! ☕</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 flex justify-center w-full">
        <div className="flex space-x-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerDownPage;
