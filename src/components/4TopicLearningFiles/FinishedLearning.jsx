import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import HomeButton from "../HomeButton";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import "./FinishedLearning.css";

const FinishedLearning = () => {
  const [showInput, setShowInput] = useState(false);
  const [numMCQs, setNumMCQs] = useState();
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
    <div className="finished-learning-container">
      <div className="finished-learning-content">
        <div className="finished-learning-card">
          <h1 className="finished-learning-title">
            Learning Complete
          </h1>
          
          <div className="finished-learning-topic">
            <h2 className="finished-learning-topic-title">Topic: <span className="finished-learning-topic-name">{topic}</span></h2>
            <div className="finished-learning-topic-divider"></div>
          </div>
          
          {!showInput ? (
            <>
              <h3 className="finished-learning-question">
                Would you like to take an MCQ test to assess what you've learned?
              </h3>
              <div className="finished-learning-buttons">
                <button
                  className="finished-learning-btn finished-learning-btn-primary"
                  onClick={handleYes}
                >
                  <IoCheckmarkCircle size={20} />
                  <span>Yes, take test</span>
                </button>
                <button
                  className="finished-learning-btn finished-learning-btn-secondary"
                  onClick={handleNo}
                >
                  <IoCloseCircle size={20} />
                  <span>No, return</span>
                </button>
              </div>
            </>
          ) : (
            <div className="finished-learning-input-section">
              <h3 className="finished-learning-input-title">
                How many MCQs would you like to generate? (max 10)
              </h3>
              <div className="finished-learning-input-container">
                <input
                  type="number"
                  id="numMCQs"
                  value={numMCQs}
                  className="finished-learning-input"
                  onChange={(e) => setNumMCQs(Math.min(Math.max(Number(e.target.value), 1), 10))}
                  onKeyDown={handleEnterPressed}
                  max="10"
                  placeholder="Enter number (1-10)"
                />
                <button
                  className="finished-learning-submit-btn"
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
      <div className="finished-learning-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default FinishedLearning;
