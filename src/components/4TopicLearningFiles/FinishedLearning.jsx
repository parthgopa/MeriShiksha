import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const FinishedLearning = () => {
  const [showInput, setShowInput] = useState(false);
  const [numMCQs, setNumMCQs] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const { topic, level } = location.state;

  const handleYes = useCallback(() => {
    setShowInput(true);
  }, []);

  const handleNo = useCallback(() => {
    navigate("/topic-learning");
  }, [navigate]);

  const handleSubmit = useCallback(() => {
    const comingfrom = "FromTopicLearning";
    navigate("/mcq-test", {
      state: { topic, level, numMCQs, comingfrom: comingfrom },
    });
  }, [navigate, topic, level, numMCQs]);
  
  const handleEnterPressed = useCallback((e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--primary-black)] via-[var(--primary-violet)]/30 to-[var(--primary-black)] text-white py-6 md:py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full bg-gradient-to-br from-[var(--primary-black)]/80 to-[var(--primary-violet)]/20 p-8 rounded-xl shadow-2xl border border-[var(--accent-teal)]/10 backdrop-blur-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
            Learning Complete
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl text-center mb-2 text-white">Topic: <span className="font-semibold">{topic}</span></h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)]"></div>
          </div>
          
          {!showInput ? (
            <>
              <h3 className="text-lg text-center mb-8">
                Would you like to take an MCQ test to assess what you've learned?
              </h3>
              <div className="flex justify-center gap-6 mb-6">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
                  onClick={handleYes}
                >
                  <IoCheckmarkCircle size={20} />
                  <span>Yes, take test</span>
                </button>
                <button
                  className="px-6 py-3 bg-[var(--primary-black)]/60 text-white rounded-lg flex items-center gap-2 hover:bg-[var(--primary-black)]/80 transition-all border border-[var(--accent-teal)]/20"
                  onClick={handleNo}
                >
                  <IoCloseCircle size={20} />
                  <span>No, return</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white text-center">
                How many MCQs would you like to generate? (max 10)
              </h3>
              <div className="flex flex-col items-center gap-4">
                <input
                  type="number"
                  id="numMCQs"
                  value={numMCQs}
                  className="w-full max-w-xs p-3 rounded-lg bg-[var(--primary-black)]/60 border border-[var(--accent-teal)]/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent focus:outline-none transition-all text-center text-lg"
                  onChange={(e) => setNumMCQs(Math.min(Math.max(Number(e.target.value), 1), 10))}
                  onKeyDown={handleEnterPressed}
                  max="10"
                  min="1"
                />
                <button
                  className="px-8 py-3 bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-medium"
                  onClick={handleSubmit}
                >
                  Start Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Home Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <HomeButton />
      </div>
    </div>
  );
};

export default FinishedLearning;
