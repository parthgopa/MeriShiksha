import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServicesSection = ({ pages, servicesSectionRef }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [animateItems, setAnimateItems] = useState(false);

  // Create refs for each category section
  const careerCraftingRef = useRef(null);
  const empoweringLearnerRef = useRef(null);
  const empoweringTutorRef = useRef(null);

  // Group pages by category
  const categories = [
    {
      id: "Career Crafting",
      title: "Career Crafting",
      description: "Plan your career path with AI-powered guidance and tools",
      ref: careerCraftingRef,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[var(--accent-teal)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "Empowering Learner",
      title: "Empowering Learner",
      description:
        "Enhance your learning experience with personalized AI tools",
      ref: empoweringLearnerRef,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[var(--accent-teal)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "Empowering Tutor",
      title: "Empowering Tutor",
      description: "Improve your teaching methods with AI-powered assistance",
      ref: empoweringTutorRef,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[var(--accent-teal)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ];

  // Function to handle category selection
  const handleCategoryClick = (categoryId) => {
    // Toggle selection if clicking the same category
    if (categoryId === selectedCategory) {
      setSelectedCategory(null);
      setAnimateItems(false);
      return;
    }

    // Set the selected category
    setAnimateItems(false);
    setTimeout(() => {
      setSelectedCategory(categoryId);
      setTimeout(() => {
        setAnimateItems(true);
      }, 100);
    }, 300);
  };

  // Function to get subcategories for Career Crafting
  const getSubcategories = (categoryId) => {
    if (categoryId === "Career Crafting") {
      return [
        { id: "AI Career in India", title: "AI Career in India" },
        { id: "Career Counselling", title: "Career Counselling" },
        { id: "Job Hunt", title: "Job Hunt" },
        { id: "Language Learning", title: "Language Learning" },
        { id: "Mock Interview", title: "Mock Interview" },
      ];
    }
    return [];
  };

  // Filter pages by category and subcategory
  const getFilteredPages = (categoryId, subcategoryId = null) => {
    if (subcategoryId) {
      return pages.filter(
        (page) =>
          page.category === categoryId &&
          (page.subcategory === subcategoryId ||
            (Array.isArray(page.subcategory) &&
              page.subcategory.includes(subcategoryId)))
      );
    }
    return pages.filter((page) => page.category === categoryId);
  };

  // Custom pages for Empowering Tutor
  const empoweringTutorPages = [
    {
      title: "Adaptive Learning",
      description: "Find and fix gaps in your knowledge",
      path: "/knowlwdgeGap-Topic-list",
      category: "Empowering Tutor",
    },
    {
      title: "Lesson Planning",
      description: "Create effective lesson plans with AI",
      path: "/lesson-plan",
      category: "Empowering Tutor",
    },
    {
      title: "Study Material",
      description: "Explore and expand your knowledge",
      path: "/topic-learning",
      category: "Empowering Tutor",
    },
    {
      title: "Summary Notes",
      description: "Get quick, dot-point topic summaries",
      path: "/dotpoint-summary",
      category: "Empowering Tutor",
    },
    {
      title: "MCQ Generator",
      description: "Generate customized MCQs",
      path: "/generate-mcqs",
      category: "Empowering Tutor",
    },
    {
      title: "AI Q and A",
      description: "AI support for classroom management",
      path: "/q-and-a",
      category: "Empowering Tutor",
    },
    {
      title: "Flash Cards",
      description: "Very short Q&A sets for active learning",
      path: "/flash-cards",
      category: "Empowering Tutor",
    },
    {
      title: "PPT Content Generator",
      description: "Create content for your presentations",
      path: "/ppt-content",
      category: "Empowering Tutor",
    },
    {
      title: "Lab Instructor Assistant",
      description: "AI assistance for lab experiments and teaching",
      path: "/lab-assistant",
      category: "Empowering Tutor",
    },
  ];

  // Custom pages for Empowering Learner
  const empoweringLearnerPages = [
    {
      title: "Knowledge Gap",
      description: "Find and fix gaps in your knowledge",
      path: "/knowlwdgeGap-Topic-list",
      category: "Empowering Learner",
    },
    {
      title: "Lesson Planning",
      description: "Create effective lesson plans with AI",
      path: "/lesson-plan",
      category: "Empowering Learner",
    },
    {
      title: "Lab Experiment Guide",
      description: "Get help with lab experiments and procedures",
      path: "/lab-assistant",
      category: "Empowering Learner",
    },
    {
      title: "Topic Learning",
      description: "Explore and expand your knowledge",
      path: "/topic-learning",
      category: "Empowering Learner",
    },
    {
      title: "Dot Point Summarizer",
      description: "Get quick, dot-point topic summaries",
      path: "/dotpoint-summary",
      category: "Empowering Learner",
    },
    {
      title: "MCQ Generator",
      description: "Generate customized MCQs",
      path: "/generate-mcqs",
      category: "Empowering Learner",
    },
    {
      title: "AI Q and A",
      description: "AI support for classroom management",
      path: "/q-and-a",
      category: "Empowering Learner",
    },
  ];

  // Render category content
  const renderCategoryContent = (categoryId) => {
    if (categoryId === "Career Crafting") {
      return (
        <div className="animate-fadeIn mt-4" ref={careerCraftingRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {getSubcategories("Career Crafting").map(
              (subcategory, subIndex) => {
                const subcategoryPages = getFilteredPages(
                  "Career Crafting",
                  subcategory.id
                );
                return subcategoryPages.map((page, index) => (
                  <div
                    key={`career-crafting-${subcategory.id}-${index}`}
                    className={`transition-all duration-500 transform ${
                      animateItems
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{
                      transitionDelay: `${subIndex * 0.1 + index * 0.05}s`,
                    }}
                    onClick={() => navigate(page.path)}
                  >
                    <div className="p-3 sm:p-4 rounded-lg hover:bg-[var(--primary-violet)]/30 cursor-pointer group transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-teal)] mr-3 group-hover:scale-125 transition-all duration-300"></div>
                        <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-[var(--accent-teal)] transition-all duration-300">
                          {page.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ));
              }
            )}
          </div>
        </div>
      );
    } else if (categoryId === "Empowering Learner") {
      return (
        <div className="animate-fadeIn mt-4" ref={empoweringLearnerRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {empoweringLearnerPages.map((page, index) => (
              <div
                key={`empowering-learner-${index}`}
                className={`transition-all duration-500 transform ${
                  animateItems
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onClick={() => navigate(page.path)}
              >
                <div className="p-3 sm:p-4 rounded-lg hover:bg-[var(--primary-violet)]/30 cursor-pointer group transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-teal)] mr-3 group-hover:scale-125 transition-all duration-300"></div>
                    <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-[var(--accent-teal)] transition-all duration-300">
                      {page.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (categoryId === "Empowering Tutor") {
      return (
        <div className="animate-fadeIn mt-4" ref={empoweringTutorRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {empoweringTutorPages.map((page, index) => (
              <div
                key={`empowering-tutor-${index}`}
                className={`transition-all duration-500 transform ${
                  animateItems
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onClick={() => navigate(page.path)}
              >
                <div className="p-3 sm:p-4 rounded-lg hover:bg-[var(--primary-violet)]/30 cursor-pointer group transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-teal)] mr-3 group-hover:scale-125 transition-all duration-300"></div>
                    <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-[var(--accent-teal)] transition-all duration-300">
                      {page.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="bg-[var(--primary-black)] text-white py-8 sm:py-12 md:py-16 animate-fadeIn"
      ref={servicesSectionRef}
      id="services"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="mb-12 text-center relative overflow-hidden">
          {/* Background Gradient with Subtle Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 opacity-70 blur-3xl animate-pulse duration-5000"></div>

          {/* Content Overlay */}
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Functionalities
            </h1>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="relative">
              {/* Category Header */}
              <div
                className={`relative cursor-pointer transition-all duration-300 transform hover:translate-x-1 ${
                  selectedCategory === category.id ? "translate-x-2" : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div
                  className={`flex items-center p-4 sm:p-5 rounded-t-lg shadow-md bg-gray-800 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-gray-800 to-purple-700 border-t border-l border-r border-teal-500/30"
                      : "hover:bg-purple-900/30"
                  }`}
                >
                  <div
                    className={`mr-3 sm:mr-4 text-2xl ${
                      selectedCategory === category.id
                        ? "text-teal-400"
                        : "text-white"
                    }`}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "text-white"
                          : "text-white"
                      }`}
                    >
                      {category.title}
                    </h3>
                  </div>
                  <div className="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-300 ${
                        selectedCategory === category.id
                          ? "rotate-180 text-teal-400"
                          : "text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Curved Connection Line - Only visible when selected */}
              {selectedCategory === category.id && (
                <div className="absolute left-7 top-[3.2rem] h-6 w-6 z-10">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,0 C12,0 24,12 24,24"
                      stroke="url(#curveGradient)"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      className="animate-dash"
                    />
                    <defs>
                      <linearGradient
                        id="curveGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="var(--accent-teal)" />
                        <stop offset="100%" stopColor="var(--primary-violet)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              {/* Category Content */}
              {selectedCategory === category.id && (
                <div className="bg-gradient-to-br from-gray-800 to-purple-900/20 border border-teal-500/30 rounded-b-lg rounded-tr-lg p-6 sm:p-8 shadow-lg text-white left-5">
                  {renderCategoryContent(category.id)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: 12;
            }
          }
          .animate-dash {
            animation: dash 3s linear infinite;
          }
          
          @media (max-width: 640px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
          
          @media (min-width: 641px) and (max-width: 1023px) {
            .grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ServicesSection;
