import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import APIService from "../API";
import LoadingSpinner from "../LoadingSpinner";
import HomeButton from "../HomeButton";
import { IoArrowBack, IoArrowForward, IoCheckmarkCircle } from "react-icons/io5";
import "./Quiz.css";

const QuizPlayQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, topic, level, numMCQs, comingfrom } = location.state;
  const [incomingdata, setIncomingdata] = useState(comingfrom);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const date = new Date().toDateString();
  const time = new Date().toTimeString();

  useEffect(() => {
    const fetchMCQs = async () => {
      let prompt;
      if (incomingdata === "FromQuizPlay") {
        prompt = `Generate ${numMCQs} Randomized MCQs(Note that this MCQs Specifically for MCQ-Quiz so this must be other than previously generated MCQs.) for the topic :'${topic}' in context with subject :${subject}  having study level :'${level}'. The output should be a valid JSON object in the following format:
      {
        "questions": ["What is the capital of France?", "What is 2 + 2?"],
        "options": [
          ["Berlin", "Madrid", "Paris", "Rome"],
          ["3", "4", "5", "6"]
        ],
        "correctAnswers": ["Paris", "4"]
      };  For current date :${date} and current time :${time}`;
      }


      setLoading(true);
      await APIService({ question: prompt, onResponse: handleOnResponse });
    };
    fetchMCQs();
  }, [numMCQs, topic, level]);

  const handleOnResponse = (response) => {
    try {
      let mcqData = response["candidates"][0]["content"]["parts"][0]["text"];
      mcqData = mcqData.slice(7, mcqData.length - 4);
      mcqData = JSON.parse(mcqData);
      console.log(mcqData);

      try {
        setQuestions(mcqData.questions);
        setOptions(mcqData.options);
        setCorrectAnswers(mcqData.correctAnswers);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        navigate("/error", { h2: "SOlve the error message" });
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    }
    setLoading(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    navigate("/final-result", {
      state: { userAnswers, correctAnswers, questions, topic, level },
    });
  };

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-header-top">
            {/* <button 
              onClick={() => navigate(-1)}
              className="quiz-back-btn"
            >
              <IoArrowBack size={20} />
            </button> */}
            <h1 className="quiz-title">
              MCQ Quiz
            </h1>
            <div className="quiz-spacer"></div>
          </div>
          
          <div className="quiz-header-info">
            <h2 className="quiz-topic">Topic: <span className="quiz-topic-name">{topic}</span></h2>
            <p className="quiz-meta">Subject: {subject} | Level: {level}</p>
            <div className="quiz-divider"></div>
          </div>
        </div>

        {loading ? (
          <div className="quiz-loading">
            <LoadingSpinner />
            <p className="quiz-loading-text">Generating quiz questions...</p>
          </div>
        ) : (
          <>
            {/* Progress Section */}
            <div className="quiz-progress-section">
              <div className="quiz-progress-header">
                <span className="quiz-progress-label">Progress</span>
                <span className="quiz-progress-count">
                  {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="quiz-progress-bar-container">
                <div
                  className="quiz-progress-bar"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Section */}
            <div className="quiz-question-section">
              <div className="quiz-question-header">
                <div className="quiz-question-badge">
                  Question {currentQuestionIndex + 1}
                </div>
                <h3 className="quiz-question-text">
                  {questions[currentQuestionIndex]}
                </h3>
              </div>

              {/* Options */}
              <div className="quiz-options">
                {options[currentQuestionIndex]?.map((option, idx) => (
                  <div
                    key={idx}
                    className={`quiz-option ${
                      userAnswers[currentQuestionIndex] === option
                        ? "selected"
                        : "unselected"
                    }`}
                    onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                  >
                    <div className="quiz-option-content">
                      <div className="quiz-option-radio">
                        {userAnswers[currentQuestionIndex] === option && (
                          <div className="quiz-option-radio-dot"></div>
                        )}
                      </div>
                      <span className="quiz-option-text">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="quiz-navigation">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="quiz-nav-btn previous"
              >
                <IoArrowBack size={18} />
                Previous
              </button>

              <div className="quiz-progress-dots">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`quiz-progress-dot ${
                      idx === currentQuestionIndex
                        ? "current"
                        : userAnswers[idx]
                        ? "answered"
                        : "unanswered"
                    }`}
                  />
                ))}
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleFinish}
                  className="quiz-nav-btn finish"
                >
                  <IoCheckmarkCircle size={18} />
                  Finish Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="quiz-nav-btn next"
                >
                  Next
                  <IoArrowForward size={18} />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Home Button */}
      <div className="quiz-home-btn">
        <HomeButton />
      </div>
    </div>
  );
};

export default QuizPlayQuiz;
