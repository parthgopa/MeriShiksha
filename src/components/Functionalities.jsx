import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HeroSection from "../components/Home/HeroSection";
import ServicesSection from "../components/Home/ServicesSection";

import gemini from "../assets/geminiImage.png";

const Functionalities = () => {
  const [open, setOpen] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const navigate = useNavigate();
  const servicesSectionRef = useRef(null);

  // Array of service pages
  const pages = [
    {
      title: "Unlock AI Careers in India",
      description: "Plan your career in AI industry",
      path: "/ai-carrier-counselling-input",
      category: "Career Crafting",
      subcategory: "AI Career in India",
    },
    {
      title: "Career Counselling",
      description: "Get personalized career advice",
      path: "/carrier-counselling-input",
      category: "Career Crafting",
      subcategory: "Career Counselling",
    },
    {
      title: "Job Hunt",
      description: "Find the perfect job for you",
      path: "/ai-job-hunt",
      category: "Career Crafting",
      subcategory: "Job Hunt",
    },
    {
      title: "Language Learning",
      description: "Master new languages efficiently",
      path: "/language-learning",
      category: "Career Crafting",
      subcategory: "Language Learning",
    },
    {
      title: "Language Accelerator",
      description: "Upgrade you Vocabulary with AI talk",
      path: "/language-accelerator",
      category: "Career Crafting",
      subcategory: "Language Learning",
    },
    {
      title: "AI Mock Interview",
      description: "Practice and perfect your interview skills",
      path: "/mock-interview",
      category: "Career Crafting",
      subcategory: "Mock Interview",
    },
    {
      title: "Knowledge Gap",
      description: "Identify and address knowledge gaps",
      path: "/knowlwdgeGap-Topic-list",
      category: "Empowering Learner",
    },
    {
      title: "Topic Learning",
      description: "Explore and expand your knowledge",
      path: "/topic-learning",
      category: "Empowering Learner",
    },
    {
      title: "DotPoint Summary",
      description: "Summarize and organize your knowledge",
      path: "/dotpoint-summary",
      category: "Empowering Learner",
    },
    {
      title: "Lesson Planning",
      description: "Create effective lesson plans with AI",
      path: "/lesson-plan",
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
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleGetStarted = () => {
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStart = () => {
    sessionStorage.setItem("welcomeShown", "true");
    setWelcomeVisible(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("welcomeShown")) {
      setWelcomeVisible(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--primary-black)] overflow-x-hidden">
      {/* Navigation Drawer */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "var(--primary-black)",
            color: "white",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              fontWeight: "bold",
              background:
                "linear-gradient(90deg, var(--accent-teal), var(--primary-violet))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Meri Shiksha
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <List>
          {pages.map((page, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(page.path);
                  handleDrawerClose();
                }}
              >
                <ListItemIcon sx={{ color: "var(--accent-teal)" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={page.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div className="relative">

        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <ServicesSection
          pages={pages}
          servicesSectionRef={servicesSectionRef}
        />


        {/* Alexa Chatbot Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => navigate("/chatbot")}
            className="bg-black p-2 bottom-15 right-0 fixed flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)] to-[var(--accent-teal)]-0 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 group"
            aria-label="Chat with AI Assistant"
          >
            <div className="relative">
              <img
                src={gemini}
                alt="AI Assistant"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="absolute bottom-full right-0 mb-2 bg-[var(--primary-black)] bg-opacity-75 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat with AI Assistant
            </span>
          </button>
        </div>

        <style>
          {`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #14b8a6 rgba(17, 24, 39, 0.3);
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(17, 24, 39, 0.3);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #14b8a6;
              border-radius: 3px;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideDown {
              from { transform: translateY(-10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
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
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .bg-size-200 {
              background-size: 200% 200%;
            }
            .bg-pos-0 {
              background-position: 0% 0%;
            }
            .bg-pos-100 {
              background-position: 100% 100%;
            }
            .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
            .animate-slideDown { animation: slideDown 0.5s ease-in-out; }
            .animate-slideUp { animation: slideUp 0.5s ease-in-out; }
            .animate-float { animation: float 3s ease-in-out infinite; }
            .animate-textSlideIn { animation: textSlideIn 1s ease-in-out; }
            .animate-bounce { animation: bounce 2s infinite; }
            .blur-3xl {
              --tw-blur: blur(64px);
              filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Functionalities;
