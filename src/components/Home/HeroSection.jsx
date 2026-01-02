import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight  } from 'react-icons/fa';
// import LandingImage from '../../assets/finallanding.jpg';

import LandingImage from "../../assets/finallanding.jpg"

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    // Scroll to services section or navigate to a specific page
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    
    <div className="relative w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)] to-[var(--accent-teal)]/80 text-white pt-20 animate-fadeIn overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="w-full h-auto mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative">
        <div className="md:w-1/2 mt-10 md:mt-0 transform hover:scale-102 transition-all duration-500">
          <img
            src={LandingImage}
            alt="Robot Illustration"
            className="lg:w-3xl w-screen h-auto mx-auto rounded-3xl shadow-2xl animate-float border-2 border-[var(--accent-teal)]/20"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left p-6">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mt-4 animate-fadeIn text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--accent-teal)]/80 to-[var(--primary-violet)]">
            Empowering Learners & Tutors
          </h1>

          <p className="mt-6 lg:mt-8 text-lg lg:text-2xl text-teal-100 animate-fadeIn w-full">
            Discover the power of adaptive learning with AI to enhance your
            knowledge and teaching efficiency.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              className="m-2 px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-lg transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center group"
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
              {/* <FaArrowRight /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
