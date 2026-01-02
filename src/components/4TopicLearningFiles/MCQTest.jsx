import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import { IoArrowBack, IoArrowForward, IoCheckmarkDone } from "react-icons/io5";
import "./MCQTest.css";

const MCQTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, level, numMCQs, comingfrom } = location.state;

  const [incomingdata, setIncomingdata] = useState(comingfrom);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const date = useMemo(() => new Date().toDateString(), []);
  const time = useMemo(() => new Date().toTimeString(), []);

  useEffect(() => {
    const fetchMCQs = async () => {
      let prompt;
      if (incomingdata === "FromParagraph") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the Paragraph Provided =>: "${topic}" at '${level}' level. The output should be a valid JSON object in the following format:\n{\n  "questions": ["What is the capital of France?", "What is 2 + 2?"],\n  "options": [\n    ["Berlin", "Madrid", "Paris", "Rome"],\n    ["3", "4", "5", "6"]\n  ],\n  "correctAnswers": ["Paris", "4"]\n}. For current date :${date} and current time :${time}`;
      } else if (incomingdata === "FromTopicLearning") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level. The output should be a valid JSON object in the following format:\n{\n  "questions": ["What is the capital of France?", "What is 2 + 2?"],\n  "options": [\n    ["Berlin", "Madrid", "Paris", "Rome"],\n    ["3", "4", "5", "6"]\n  ],\n  "correctAnswers": ["Paris", "4"]\n};  For current date :${date} and current time :${time}`;
      } else if (incomingdata === "RetakeMCQs" || incomingdata === "Quiz Play") {
        prompt = `Generate ${numMCQs} Randomized MCQs for the topic '${topic}' at '${level}' level different from the previous one. The output should be a valid JSON object in the following format:\n{\n  "questions": ["What is the capital of France?", "What is 2 + 2?"],\n  "options": [\n    ["Berlin", "Madrid", "Paris", "Rome"],\n    ["3", "4", "5", "6"]\n  ],\n  "correctAnswers": ["Paris", "4"]\n};  For current date :${date} and current time :${time}`;
      }
      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [numMCQs, topic, level, incomingdata, date, time]);

  const handleOnResponse = useCallback((response) => {
    try {
      let mcqData = response["candidates"][0]["content"]["parts"][0]["text"];
      mcqData = mcqData.slice(7, mcqData.length - 4);
      mcqData = JSON.parse(mcqData);
      setQuestions(mcqData.questions);
      setOptions(mcqData.options);
      setCorrectAnswers(mcqData.correctAnswers);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      navigate("/error", { h2: "SOlve the error message" });
    }
    setLoading(false);
  }, [navigate]);

  const handleAnswerChange = useCallback((questionIndex, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev - 1);
  }, []);

  const handleFinish = useCallback(() => {
    navigate("/final-result", {
      state: {
        userAnswers,
        correctAnswers,
        questions,
        topic,
        level,
      },
    });
  }, [navigate, userAnswers, correctAnswers, questions, topic, level]);

  // Memoize current options and question for performance
  const currentOptions = useMemo(() => options[currentQuestionIndex] || [], [options, currentQuestionIndex]);
  const currentQuestion = useMemo(() => questions[currentQuestionIndex] || '', [questions, currentQuestionIndex]);

  return (
    <div className="mcq-test-container">
      <div className="mcq-test-content">
        {/* Header */}
        <div className="mcq-test-header">
          <h1 className="mcq-test-title">
            {incomingdata === "FromTopicLearning" && `MCQ Quiz: ${topic}`}
            {incomingdata === "FromParagraph" && "MCQ Quiz"}
            {incomingdata === "RetakeMCQs" && "ReTest Quiz"}
            {incomingdata === "Quiz Play" && "Quiz Play"}
          </h1>
          
          {/* Progress Bar */}
          {!loading && (
            <div className="mcq-test-progress-container">
              <div
                className="mcq-test-progress-bar"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          )}
          
          {/* Question Counter */}
          {!loading && questions.length > 0 && (
            <div className="mcq-test-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="mcq-test-question-card">
          {loading ? (
            <div className="mcq-test-loading">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="mcq-test-question-content">
                <h2 className="mcq-test-question-text">
                  {currentQuestion}
                </h2>
                <div className="mcq-test-options">
                  {currentOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className={`mcq-test-option ${
                        userAnswers[currentQuestionIndex] === option
                          ? "selected"
                          : "unselected"
                      }`}
                      onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                    >
                      <input
                        type="radio"
                        id={`mcq-${currentQuestionIndex}-option-${idx}`}
                        name={`mcq-${currentQuestionIndex}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={() => handleAnswerChange(currentQuestionIndex, option)}
                        className="mcq-test-option-input"
                      />
                      <label
                        htmlFor={`mcq-${currentQuestionIndex}-option-${idx}`}
                        className="mcq-test-option-label"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Navigation Buttons */}
        {!loading && (
          <div className="mcq-test-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`mcq-test-nav-btn previous ${
                currentQuestionIndex === 0 ? "" : ""
              }`}
            >
              <IoArrowBack size={20} />
              <span>Previous</span>
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="mcq-test-nav-btn next"
              >
                <span>Next</span>
                <IoArrowForward size={20} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="mcq-test-nav-btn finish"
              >
                <span>Finish</span>
                <IoCheckmarkDone size={20} />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Home Button */}
      <div className="mcq-test-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default MCQTest;
