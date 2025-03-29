import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FunctionalityCard from './FunctionalityCard';

const ServicesSection = ({ pages, servicesSectionRef }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "Empowering Learner",
      title: "Empowering Learner",
      description: "Enhance your learning experience with personalized AI tools",
      ref: empoweringLearnerRef,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: "Empowering Tutor",
      title: "Empowering Tutor",
      description: "Improve your teaching methods with AI-powered assistance",
      ref: empoweringTutorRef,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  // Function to handle category selection
  const handleCategoryClick = (categoryId) => {
    // Toggle selection if clicking the same category
    if (categoryId === selectedCategory) {
      setSelectedCategory(null);
      return;
    }
    
    // Set the selected category
    setSelectedCategory(categoryId);
    
    // Scroll to the appropriate section after a short delay to allow rendering
    setTimeout(() => {
      const ref = categories.find(cat => cat.id === categoryId)?.ref;
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Function to get subcategories for Career Crafting
  const getSubcategories = (categoryId) => {
    if (categoryId === "Career Crafting") {
      return [
        { id: "AI Career in India", title: "AI Career in India" },
        { id: "Career Counselling", title: "Career Counselling" },
        { id: "Job Hunt", title: "Job Hunt" },
        { id: "Language Learning", title: "Language Learning" },
        { id: "Mock Interview", title: "Mock Interview" }
      ];
    }
    return [];
  };

  // Filter pages by category and subcategory
  const getFilteredPages = (categoryId, subcategoryId = null) => {
    if (subcategoryId) {
      return pages.filter(page => 
        page.category === categoryId && 
        (page.subcategory === subcategoryId || 
         (Array.isArray(page.subcategory) && page.subcategory.includes(subcategoryId)))
      );
    }
    return pages.filter(page => page.category === categoryId);
  };

  // Custom pages for Empowering Tutor
  const empoweringTutorPages = [
    {
      title: "Lesson Planning",
      description: "Create effective lesson plans with AI",
      path: "/lesson-plan",
      category: "Empowering Tutor"
    },
    {
      title: "MCQ Generator",
      description: "Generate customized MCQs",
      path: "/generate-mcqs",
      category: "Empowering Tutor"
    },
    {
      title: "AI Q and A",
      description: "AI support for classroom management",
      path: "/q-and-a",
      category: "Empowering Tutor"
    },
    {
      title: "Flash Cards",
      description: "Very short Q&A sets for active learning",
      path: "/flash-cards",
      category: "Empowering Tutor"
    },
    {
      title: "PPT Content Generator",
      description: "Create content for your presentations",
      path: "/ppt-content",
      category: "Empowering Tutor"
    }
  ];

  // Custom pages for Empowering Learner
  const empoweringLearnerPages = [
    {
      title: "Lesson Planning",
      description: "Create effective lesson plans with AI",
      path: "/lesson-plan",
      category: "Empowering Learner"
    },
    {
      title: "MCQ Generator",
      description: "Generate customized MCQs",
      path: "/generate-mcqs",
      category: "Empowering Learner"
    },
    {
      title: "AI Q and A",
      description: "AI support for classroom management",
      path: "/q-and-a",
      category: "Empowering Learner"
    },
    {
      title: "Knowledge Gap",
      description: "Find and fix gaps in your knowledge",
      path: "/knowlwdgeGap-Topic-list",
      category: "Empowering Learner"
    },
    {
      title: "Topic Learning",
      description: "Explore and expand your knowledge",
      path: "/topic-learning",
      category: "Empowering Learner"
    },
    {
      title: "Dot Point Summarizer",
      description: "Get quick, dot-point topic summaries",
      path: "/dotpoint-summary",
      category: "Empowering Learner"
    }
  ];

  return (
    <div className="bg-[var(--primary-black)] text-white py-16 animate-fadeIn" ref={servicesSectionRef} id="services">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
          Our Services
        </h2>

        {/* Main Categories - Vertical Layout */}
        <div className="flex flex-col space-y-6 mb-16 max-w-3xl mx-auto">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`relative bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer text-white border ${selectedCategory === category.id ? 'border-[var(--accent-teal)]' : 'border-transparent hover:border-[var(--accent-teal)]/30'}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]"></div>
              <div className="p-8 flex items-center">
                <div className="mr-6 p-3 rounded-full bg-[var(--primary-black)]/50 border border-[var(--accent-teal)]/20">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {category.title}
                  </h3>
                  <p className="text-teal-100 mb-4">{category.description}</p>
                  <div className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-teal)] via-[var(--primary-violet)] to-[var(--accent-teal)] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-lg shadow-md transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center justify-center group max-w-xs">
                    <span>{selectedCategory === category.id ? 'Hide Features' : 'Explore Features'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-2 transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Display subcategories for Career Crafting */}
        {selectedCategory === "Career Crafting" && (
          <div className="mb-16 animate-fadeIn" ref={careerCraftingRef}>
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-white inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-teal)] to-white">Career Crafting Features</span>
              </h2>
              <div className="absolute -bottom-4 left-0 w-20 h-1 bg-[var(--accent-teal)]"></div>
              <div className="absolute -bottom-4 left-20 w-full h-px bg-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {getSubcategories("Career Crafting").map((subcategory) => {
                const subcategoryPages = getFilteredPages("Career Crafting", subcategory.id);
                return subcategoryPages.map((page, index) => (
                  <FunctionalityCard 
                    key={`career-crafting-${subcategory.id}-${index}`}
                    page={page} 
                    index={index} 
                    pageIndex={pages.indexOf(page)} 
                  />
                ));
              })}
            </div>
          </div>
        )}

        {/* Display Empowering Learner features */}
        {selectedCategory === "Empowering Learner" && (
          <div className="mb-16 animate-fadeIn" ref={empoweringLearnerRef}>
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-white inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-teal)] to-white">Empowering Learner Features</span>
              </h2>
              <div className="absolute -bottom-4 left-0 w-20 h-1 bg-[var(--accent-teal)]"></div>
              <div className="absolute -bottom-4 left-20 w-full h-px bg-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {empoweringLearnerPages.map((page, index) => (
                <FunctionalityCard 
                  key={`empowering-learner-${index}`}
                  page={page} 
                  index={index} 
                  pageIndex={index} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Display Empowering Tutor features */}
        {selectedCategory === "Empowering Tutor" && (
          <div className="mb-16 animate-fadeIn" ref={empoweringTutorRef}>
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold text-white inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-teal)] to-white">Empowering Tutor Features</span>
              </h2>
              <div className="absolute -bottom-4 left-0 w-20 h-1 bg-[var(--accent-teal)]"></div>
              <div className="absolute -bottom-4 left-20 w-full h-px bg-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {empoweringTutorPages.map((page, index) => (
                <FunctionalityCard 
                  key={`empowering-tutor-${index}`}
                  page={page} 
                  index={index} 
                  pageIndex={index} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
