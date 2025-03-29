import React, { useState } from "react";
import { useNavigate } from "react-router";
import HomeButton from "../HomeButton";
import { IoArrowForward } from "react-icons/io5";
import { FaGraduationCap, FaBook, FaQuestionCircle, FaChalkboardTeacher } from "react-icons/fa";

const GenerateMCQs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    level: "Primary",
    numMCQs: "5"
  });
  const [warning, setWarning] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'SubjectEntry': 'subject',
      'topicEntry': 'topic',
      'levelEntry': 'level',
      'numMCQsEntry': 'numMCQs'
    };
    
    setFormData(prev => ({
      ...prev,
      [fieldMap[id] || id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.subject && formData.topic) {
      navigate("/generate-mcqs/questions", {
        state: {
          subject: formData.subject,
          topic: formData.topic,
          level: formData.level,
          numMCQs: formData.numMCQs,
        },
      });
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
    }
  };

  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-10 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Left Section - Features */}
        <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] to-white">
              MCQ Generator Features
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[var(--accent-teal)]/10 p-3 rounded-lg">
                  <FaQuestionCircle className="text-[var(--accent-teal)] text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Custom Questions</h4>
                  <p className="text-gray-300">Generate questions tailored to your specific subject and topic</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[var(--accent-teal)]/10 p-3 rounded-lg">
                  <FaGraduationCap className="text-[var(--accent-teal)] text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Multiple Difficulty Levels</h4>
                  <p className="text-gray-300">Choose from primary to advanced difficulty settings</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[var(--accent-teal)]/10 p-3 rounded-lg">
                  <FaBook className="text-[var(--accent-teal)] text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Comprehensive Coverage</h4>
                  <p className="text-gray-300">Generate up to 10 questions per topic</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[var(--accent-teal)]/10 p-3 rounded-lg">
                  <FaChalkboardTeacher className="text-[var(--accent-teal)] text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Educational Value</h4>
                  <p className="text-gray-300">Perfect for teachers and students to test knowledge</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-2/3 max-w-2xl">
          <div className="bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Generate Multiple Choice Questions
            </h2>

            <form
              onSubmit={handleSubmit}
              onKeyDown={handleEnterPressed}
              className="space-y-6"
            >
              {/* Subject Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="SubjectEntry"
                  className="block text-lg font-medium text-white"
                >
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                  id="SubjectEntry"
                  placeholder="Physics, Mathematics, History, etc."
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              {/* Topic Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="topicEntry"
                  className="block text-lg font-medium text-white"
                >
                  Topic
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent placeholder-gray-400 transition-all"
                  id="topicEntry"
                  placeholder="Gravity, Algebra, World War II, etc."
                  value={formData.topic}
                  onChange={handleChange}
                />
              </div>

              {/* Level Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="levelEntry"
                  className="block text-lg font-medium text-white"
                >
                  Difficulty Level
                </label>
                <select
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all"
                  id="levelEntry"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="High School">High School</option>
                  <option value="College Level">College Level</option>
                </select>
              </div>

              {/* Number of MCQs */}
              <div className="space-y-2">
                <label
                  htmlFor="numMCQsEntry"
                  className="block text-lg font-medium text-white"
                >
                  Number of Questions
                </label>
                <select
                  className="w-full p-4 rounded-xl bg-[var(--primary-black)]/60 text-white border border-[var(--accent-teal)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent transition-all"
                  id="numMCQsEntry"
                  value={formData.numMCQs}
                  onChange={handleChange}
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="7">7 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
              </div>

              {warning && (
                <div className="p-4 bg-red-500/20 border border-red-600 rounded-xl text-center text-white animate-pulse">
                  Please enter both subject and topic.
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 flex items-center gap-2"
                >
                  <span>Generate Questions</span>
                  <IoArrowForward />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default GenerateMCQs;
