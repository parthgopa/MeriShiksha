import React, { useCallback, useEffect, useRef, useState, lazy } from "react";
import LandingImage from "../assets/finallanding.jpg";
import Mylogo from "../assets/MyLogonew.png";
import { useNavigate } from "react-router";
import gemini from "../assets/geminiImage.png";
import LoadingSpinner from "./LoadingSpinner";

const LazyImage = lazy(() => import("../assets/chatbot.jpg"));
// import LoadingSpinner from "./LoadingSpinner";

const Functionalities = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const servicesSectionRef = useRef(null);
  const navDrawerRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("welcomeShown")) {
      setWelcomeVisible(false);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navDrawerRef.current && !navDrawerRef.current.contains(event.target) && 
          navDrawerOpen && !event.target.closest('button[aria-label="Toggle navigation"]')) {
        setNavDrawerOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navDrawerOpen]);

  const handleStart = () => {
    sessionStorage.setItem("welcomeShown", "true");
    setWelcomeVisible(false);
  };

  const handleGetStarted = useCallback(() => {
    sessionStorage.setItem("welcomeShown", "true");
    setWelcomeVisible(false);

    // Get the position of the "Our Services" section
    const servicesSectionTop = servicesSectionRef.current.offsetTop;

    // Scroll to the "Our Services" section
    window.scrollTo({
      top: servicesSectionTop,
      behavior: "smooth",
    });
  }, []);

  const pages = [
    {
      title: "Unlock AI Carriers in India",
      description: "Plan your career in AI industry",
      path: "/interview-language-input",
    },
    {
      title: "Career Counselling",
      description: "Plan your career with AI guidance",
      path: "/carrier-counciling",
    },
    {
      title: "Knowledge Gap",
      description: "Find and fix gaps in your knowledge",
      path: "/knowlwdgeGap-Topic-list",
    },
    {
      title: "Lesson Plan",
      description: "Detailed teaching or learning plans",
      path: "/lesson-plan",
    },
    {
      title: "Topic Learning",
      description: "Explore and expand your knowledge",
      path: "/topic-learning",
    },
    {
      title: "Dot Point Summarizer",
      description: "Get quick, dot-point topic summaries",
      path: "/dotpoint-summary",
    },
    {
      title: "MCQ Generator",
      description: "Make multiple-choice questions for practice",
      path: "/generate-mcqs",
    },
    {
      title: "Q & A",
      description: "Long and short Q&A sets with fill ups",
      path: "/q-and-a",
    },
    {
      title: "Quiz Play",
      description: "Fun, quick quizzes to test your smarts!",
      path: "quiz-play",
    },
    {
      title: "Flash Cards",
      description: "Very short Q&A sets for active learning",
      path: "/flash-cards",
    },
    {
      title: "PPT Content Generator",
      description: "Create content for your presentations",
      path: "/ppt-content",
    },
    {
      title: "Learn Language",
      description: "Read the screen and reply to AI",
      path: "/language-learning",
    },
    {
      title: "Language Accelerator",
      description: "Boost your language vocabulary",
      path: "/language-accelerator",
    },
    {
      title: "AI Lab Assistant",
      description: "Get you personal Lab Assistant",
      path: "/lab-assistant",
    },
    {
      title: "AI Job Hunt",
      description: "Build your carrier by finding best Jobs",
      path: "/ai-job-hunt",
    },
    {
      title: "AI Mock Interview",
      description: "Give Interview and train yourself",
      path: "/mock-interview",
    },
  ];
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setNavDrawerOpen(false);
    }
  };

  return (
    <>
      {/* <AdComponent></AdComponent> */}
      <div>
        
        <button
          onClick={() => setNavDrawerOpen(!navDrawerOpen)}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-red-700 text-white p-2 rounded-l-lg shadow-lg z-50 transition-all duration-300"
        >
          {navDrawerOpen ? ">" : "<"}
        </button>
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-gradient-to-l from-black via-secondary to-black text-white transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
            navDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        ></div>
      </div>
      {welcomeVisible && (
        
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-sm  rounded-lg p-6 animate-fadeIn">
          <div className="max-w-md text-center">

            <div className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
              {/* Welcome Heading */}
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                Welcome to
              </h3>

              {/* Main Title */}

              <h1 className="font-extrabold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-clip-text bg-gradient-to-r from-accent mb-4">
                AI-based Meri Shiksha
              </h1>

              {/* Subtext */}
              <p className="text-xl sm:text-lg md:text-xl lg:text-2xl text-white mb-0 sm:mb-6">
                Empowering
              </p>

              {/* Secondary Heading */}
              <h2 className="text-md sm:text-lg md:text-xl lg:text-2xl text-white mb-4 sm:mb-6">
                Learner & Tutor
              </h2>

              {/* Call-to-Action Button */}
              <button
                className="mt-4 !text-xl text-white px-8  py-3 lg:w-45 lg:h-auto sm:mt-6  sm:px-8 sm:py-3 sm:text-lg bg-gradient-to-l from-red-600 via-40% to-black  rounded-lg shadow-md hover:from-red-700 hover:to-black transition-all transform hover:scale-105 "
                onClick={handleStart}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-111a48 text-white z-40 h-15">
        <a href="#">
          <img
            src={Mylogo}
            alt="Logo"
            className="w-10 h-10 rounded-full cursor-pointer m-3 "
          />
        </a>
        <div className="fixed top-4 right-4 w-auto max-w-screen-xl px-4 py-2 flex items-center justify-end space-x-4 bg-transparent rounded-lg z-50 animate-slideDown md:top-4 md:right-6 lg:top-6 lg:right-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              className="text-sm m-1 md:text-base lg:text-lg hover:text-ef5262 transition-colors"
              onClick={() => {
                setNavDrawerOpen(true);
                setMenuOpen(false);
              }}
            >
              Functionalities
            </button>
            <button
              className="text-sm m-1 md:text-base lg:text-lg hover:text-ef5262 transition-colors"
              onClick={() => navigate("/aboutUs")}
            >
              About Us
            </button>
            <button
              className="text-sm m-1 md:text-base lg:text-lg hover:text-ef5262 transition-colors"
              onClick={() => navigate("/contactUs")}
            >
              Contact Us
            </button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-black via-secondary to-black rounded-lg shadow-xl py-2 z-50">
                <button
                  className="block mt-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-accent transition-colors"
                  onClick={() => {
                    setNavDrawerOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Functionalities
                </button>
                <button
                  className="block mt-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-accent transition-colors"
                  onClick={() => {
                    navigate("/aboutUs");
                    setMenuOpen(false);
                  }}
                >
                  About Us
                </button>
                <button
                  className="block mt-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-accent transition-colors"
                  onClick={() => {
                    navigate("/contactUs");
                    setMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Navigation Drawer Toggle Button */}
      <button
        onClick={() => setNavDrawerOpen(!navDrawerOpen)}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-red-700 text-white p-2 rounded-l-lg shadow-lg z-50 transition-all duration-300"
      >
        {navDrawerOpen ? ">" : "<"}
      </button>

      {/* Navigation Drawer */}
      <div
        ref={navDrawerRef}
        className={`fixed right-0 top-0 h-full w-64 bg-gradient-to-l from-black via-secondary to-black text-white transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-accent">
          <h2 className="text-2xl font-bold text-accent">Functionalities</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-4">
            {pages.map((page, index) => (
              <li key={index}>
                <button
                  onClick={() => scrollToSection(`functionality-${index}`)}
                  className="w-full btn btn-secondary text-left py-2 px-4 hover:bg-accent hover:bg-opacity-20 rounded-lg transition-all duration-200"
                >
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r  from-primary from-60% to-accent to-1%% text-white pt-20 animate-fadeIn">
        {/* <ServerDownPage></ServerDownPage> */}

        <div className="w-full h-auto mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src={LandingImage}
              alt="Robot Illustration"
              className="lg:w-3xl w-screen h-auto mx-auto rounded-3xl shadow-lg animate-float "
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            {/* <h1 className="text-5xl bg-clip-text text-white font-light animate-textSlideIn ">
              Welcome to AI-based Meri Shiksha
            </h1> */}
            <h1 className="!text-3xl !mb-1.5 lg:!text-7xl font-bold mt-4 animate-fadeIn text-white">
              Empowering Learners & Tutors
            </h1>

            <p className="lg:!mt-14 lg:!text-2xl text-gray-300 animate-fadeIn w-full flex justify-center items-center">
              Discover the power of adaptive learning with AI to enhance your
              knowledge and teaching efficiency.
            </p>
          </div>
        </div>
      </div>
      {/* Our Services Section */}
      <div className="bg-black text-white py-3">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page, index) => (
              <div
                key={index}
                id={`functionality-${index}`}
                className="relative bg-gradient-to-b from-accent via-20% via-secondary via-65% to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 cursor-pointer text-white"
                onClick={() => navigate(page.path)}
              >
                <div className="p-6">
                  <h3 className="!text-2xl sm:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-bold text-white mb-3">
                    {page.title}
                  </h3>


                  <p className="text-gray-200">{page.description}</p>
                  <button className="mt-2 px-4 py-2 bg-gradient-to-r from-black via-10% to-red-500  text-white rounded-lg shadow-md hover:from-red-700 hover:to-white transition-all transform hover:scale-105 animate-bounce">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-black text-white py-8 animate-fadeIn ">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <a href="#">
            <img
              src={Mylogo}
              alt="Logo"
              className="w-16 h-16 mx-auto mb-4 animate-float rounded-4xl"
            />
          </a>

          <p className="text-gray-400">
            2024 AI-based Meri Shiksha. All Rights Reserved.
          </p>
        </div>
      </footer>
      {/* Alexa Chatbot Button */}
      <div className="fixed bottom-14 right-0 z-50 lg:bottom-18 lg:right-10 ">
        <button
          onClick={() => navigate("/chatbot")}
          className=" p-2 lg:w-15 lg:h-15 lg:text-5xl lg:p-8 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <img
            src={gemini}
            alt="Chatbot"
            className="bg-transparent h-6 sm:max-w-sm md:max-w-md sm:h-48 md:h-56 lg:h-auto lg:w-10 cursor-pointer"
          />
        </button>
      </div>

      <style>
        {`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #ef5262 rgba(0, 0, 0, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #ef5262;
            border-radius: 3px;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translateY(-10px); }
            to { transform: translateY(0); }
          }
          @keyframes slideUp {
            from { transform: translateY(10px); }
            to { transform: translateY(0); }
          }
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          @keyframes textSlideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          .animate-slideDown { animation: slideDown 0.5s ease-in-out; }
          .animate-slideUp { animation: slideUp 0.5s ease-in-out; }
          .animate-float { animation: float 2.5s ease-in-out infinite; }
          .animate-textSlideIn { animation: textSlideIn 1s ease-in-out; }
          .animate-bounce { animation: bounce 2s infinite; }
        `}
      </style>
    </>
  );
};

export default Functionalities;
