import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";

const FinishedLearning = () => {
  const [showInput, setShowInput] = useState(false);
  const [numMCQs, setNumMCQs] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const { topic, level } = location.state;

  const handleYes = () => {
    setShowInput(true);
  };

  const handleNo = () => {
    navigate("/topic-learning"); // Navigate back to home or any other component
  };

  const handleSubmit = () => {
    const comingfrom = "FromTopicLearning";
    navigate("/mcq-test", {
      state: { topic, level, numMCQs, comingfrom: comingfrom },
    }); // Navigate to MCQ test component with number of MCQs
  };
  const handleEnterPressed = (e) => {
    if (e.key === "Enter") {
      handleSubmit;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-black via-secondary to-black text-white py-12 px-6 flex justify-center items-center">
      <div className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg space-y-6 bg-gradient-to-r from-secondary via-20% to-black">
        <h1
          className="text-2xl font-bold text-center mb-6 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Finished Learning
        </h1>
        <h5 className="text-lg text-center mb-4">
          Would you like to take an MCQ test of what you have learned?
        </h5>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className="px-6 py-2 rounded-lg btn btn-info hover:bg-cardaccent transition-all transform hover:scale-105"
            onClick={handleYes}
          >
            Yes
          </button>
          <button
            className="px-6 py-2 rounded-lg btn btn-dark hover:bg-gray-700 transition-all transform hover:scale-105"
            onClick={handleNo}
          >
            No
          </button>
        </div>
        {showInput && (
          <div className="space-y-4">
            <h5
              htmlFor="numMCQs"
              className="block text-lg font-medium text-white text-center"
            >
              How many MCQs would you like to generate? (max 10)
            </h5>
            <input
              type="number"
              id="numMCQs"
              className="w-full p-3 rounded-lg bg-secondary placeholder-gray-400 text-white focus:ring-2 focus:ring-accent focus:outline-none"
              onChange={(e) =>
                setNumMCQs(Math.min(Math.max(e.target.value, 1), 10))
              }
              max="10"
              min="1"
            />
            <div className="text-center">
              <button
                className="px-6 py-2 btn btn-info rounded-lg  hover:bg-cardaccent mt-4 transition-all transform hover:scale-105"
                onClick={handleSubmit}
                onKeyDown={handleEnterPressed}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        <div className="mt-8">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};

export default FinishedLearning;
