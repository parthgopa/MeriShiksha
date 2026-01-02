import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase,FaUserGraduate,FaChalkboardTeacher } from "react-icons/fa";

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
      icon: 
        <FaBriefcase />
    },
    {
      id: "Empowering Learner",
      title: "Empowering Learner",
      description:
        "Enhance your learning experience with personalized AI tools",
      ref: empoweringLearnerRef,
      icon: <FaUserGraduate/>,
    },
    {
      id: "Empowering Tutor",
      title: "Empowering Tutor",
      description: "Improve your teaching methods with AI-powered assistance",
      ref: empoweringTutorRef,
      icon: <FaChalkboardTeacher/>,
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
      }, 20);
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

  // Inside your component file
const CategoryContent = ({ pages, refProp }) => {
  return (
    <div className="animate-fadeIn mt-4" ref={refProp}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {pages.map((page, index) => (
          <div
            key={page.id || index}
            className={`transition-all duration-500 transform ${
              animateItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 0.1}s` }}
            onClick={() => navigate(page.path)}
          >
            <div className="p-2  rounded-lg hover:bg-[var(--primary-violet)]/30 cursor-pointer group transition-all duration-300 sm:p-2 xs:p-3">
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
};

// Usage inside renderCategoryContent
const renderCategoryContent = (categoryId) => {
  if (categoryId === "Career Crafting") {
    const pages = getSubcategories("Career Crafting").flatMap((sub, subIndex) =>
      getFilteredPages("Career Crafting", sub.id).map((page, index) => ({
        ...page,
        delay: subIndex * 0.1 + index * 0.05,
      }))
    );
    return <CategoryContent pages={pages} refProp={careerCraftingRef} />;
  }

  if (categoryId === "Empowering Learner") {
    return <CategoryContent pages={empoweringLearnerPages} refProp={empoweringLearnerRef} />;
  }

  if (categoryId === "Empowering Tutor") {
    return <CategoryContent pages={empoweringTutorPages} refProp={empoweringTutorRef} />;
  }
  return null;
};

  // CategoryHeader.jsx (inline or same file)
const CategoryHeader = ({ category, selectedCategory, onClick }) => (
  <div
    className={`relative cursor-pointer transition-all duration-300 transform`}
    onClick={() => onClick(category.id)}
  >
    <div
      className={`flex items-center p-4 rounded-t-lg shadow-md bg-gray-800 transition-all duration-300 ${
        selectedCategory === category.id
          ? "bg-gradient-to-r from-purple-900 to-purple-800 border-t border-l border-r border-teal-500/30"
          : "hover:bg-blue-500/30"
      }`}
    >
      <div
        className={`mr-3 sm:mr-4 text-2xl ${
          selectedCategory === category.id ? "text-teal-400" : "text-white"
        }`}
      >
        {category.icon}
      </div>
      <h3 className="text-xl font-semibold text-white transition-all duration-300">
        {category.title}
      </h3>
    </div>
  </div>
);

// CategoryBlock.jsx (inline or same file)
const CategoryBlock = ({ category, selectedCategory, onClick }) => (
  <div key={category.id} className="relative">
    <CategoryHeader
      category={category}
      selectedCategory={selectedCategory}
      onClick={onClick}
    />
    {selectedCategory === category.id && (
      <div className="bg-gradient-to-br from-gray-800 to-purple-900/20 border border-teal-500/30 rounded-b-lg rounded-tr-lg p-4 xs:p-2 sm:p-6
 shadow-lg text-white left-5">
        {renderCategoryContent(category.id)}
      </div>
    )}
  </div>
);

// Main return
return (
  <div
    className="bg-[var(--primary-black)] text-white py-8 sm:py-12 md:py-16 animate-fadeIn"
    ref={servicesSectionRef}
    id="services"
  >
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Section Header */}
      <div className="mb-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 opacity-70 blur-3xl animate-pulse duration-5000"></div>
        <div className="relative">
          <h1 className="text-4xl font-extrabold text-white p-2 align:middle">Functionalities</h1>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6 md:space-y-10">
        {categories.map((category) => (
          <CategoryBlock
            key={category.id}
            category={category}
            selectedCategory={selectedCategory}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
    </div>
  </div>
);
};

export default ServicesSection;
